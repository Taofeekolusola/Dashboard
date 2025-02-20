const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


//Register a User
const registerHandler = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ email, password: hashedPassword });
        res.status(200).json({ message: "User created" });
        await newUser.save();
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login a User
const loginHandler = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

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

    const resetCode = crypto.randomInt(100000, 999999).toString();
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
    registerHandler,
  requestPasswordReset,
  resetPassword,
  verifyResetCode,
};