const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// LoginHandler
const loginHandler = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = await User.findOne({ email });
  
      if (!user) {
        // Generate a temporary random password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
        // Create a new user with the generated password
        user = new User({ email, password: hashedPassword });
        await user.save();
  
        // Log the user in and return token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
  
        return res.status(200).json({ token, firstTimeLogin: true });
      }
  
      if (user.password) {
        // If password exists, validate it
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      }
  
      // Log in the user and return token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      return res.status(200).json({ token, firstTimeLogin: false });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };  

// const loginHandler = async (req, res) => {
//   try {
//     const { email, password, rememberMe } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     //valid email dormain address
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format!" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Set token expiration based on 'rememberMe'
//     const tokenExpiration = rememberMe ? '30d' : '1d'; // 30 days if checked, 1 day otherwise
//     const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: tokenExpiration }
//     );

//     // Set cookie based on 'rememberMe'
//     res.cookie("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: cookieMaxAge, // 30 days or 1 day
//     });

//     return res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// Send Email Helper Function
const sendEmail = async (email, resetCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code",
    html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>
           <p>Use this code to reset your password. The code expires in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = crypto.randomInt(10000, 99999).toString();
    const expiresAt = Date.now() + 3600000; // 1-hour expiry

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    await sendEmail(user.email, resetCode);

    return res.status(200).json({ message: "Password reset code sent to your email" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Verify Reset Code
const verifyResetCode = async (req, res) => {
  try {
    const { resetCode } = req.body;

    const user = await User.findOne({ resetPasswordToken: resetCode });

    if (!user || Date.now() > user.resetPasswordExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Generate the verification token
    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Calculate the expiration date
    const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save the token and expiration date in the database
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = verificationTokenExpiresAt;
    await user.save();

    return res.json({ message: "Reset code verified", verificationToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, resetCode, email } = req.body;
    
    if (!email && !resetCode) {
      return res.status(400).json({ message: "Email or reset code is required" });
    } 

    //const token = req.headers.authorization?.split(" ")[1];

    // if (!token) {
    //   return res.status(401).json({ message: "Unauthorized request" });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// // Get User by Id
// const getUserByIdHandler = async (req, res) => {
//   try {
//     const userId = await User.findById(req.params.id)

//     if (!userId) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json({ userId });
//   } catch (error) {
//     console.error("Get user by id error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
module.exports = {
  loginHandler,
  requestPasswordReset,
  resetPassword,
  verifyResetCode,
};