const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { sendOtpEmail, sendEmail, sendResetEmail } = require('../utils/senOtpEmail');


//Register a User
const registerHandler = async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ✅ Handle Profile Picture
      let profilePicture = "uploads/default.png"; // Default profile picture
      if (req.file) {
        profilePicture = `/uploads/${req.file.filename}`;
      }
  
      // ✅ Create and Save User
      const newUser = new User({ email, password: hashedPassword, role, profilePicture });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Login Handler for Admis
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

        // Generate a 6-digit OTP using crypto
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash OTP for security before saving
        user.otp = crypto.createHash("sha256").update(otp).digest("hex");
        user.otpExpires = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Login OTP",
            text: `Your OTP for login is: ${otp}. It is valid for 2 minutes.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const verifyLoginHandler = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash the entered OTP and compare with stored OTP
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        if (hashedOtp !== user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP is valid, clear OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.json({
            token,
            email,
            role: user.role,
            profilePicture: user.profilePicture
        }); 

    } catch (error) {
        console.error("OTP Verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Resend Otp code
const resendOtpHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // Update OTP and expiry time (2 minutes)
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 2 * 60 * 1000;
        await user.save();

        // Send OTP email using reusable function
        await sendOtpEmail(email, otp);

        return res.json({ message: "OTP resent successfully" });

    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
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
const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit reset code

const verifyResetCode = async (req, res) => {
  try {
    const { resetCode } = req.body;

    const user = await User.findOne({ resetPasswordToken: resetCode });

    if (!user) {
      return res.status(400).json({ message: "Invalid reset code." });
    }

    // Check if the reset code is expired
    if (!user.resetPasswordExpiresAt || Date.now() > user.resetPasswordExpiresAt) {
      // Generate a new reset code
      const newResetCode = generateResetCode();
      const hashedResetCode = crypto.createHash("sha256").update(newResetCode).digest("hex");

      // Set new reset code and expiry (15 minutes from now)
      user.resetPasswordToken = hashedResetCode;
      user.resetPasswordExpiresAt = Date.now() + 2 * 60 * 1000;
      await user.save();

      // Send the new reset code to the user's email (Simulated in console.log)
      console.log(`New reset code sent to ${user.email}: ${newResetCode}`); // Replace with actual email sending logic

      return res.status(400).json({ message: "Reset code expired. A new reset code has been sent to your email." });
    }

    // Generate the verification token
    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save the verification token in the database
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now
    await user.save();

    return res.json({ message: "Reset code verified", verificationToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resendResetCodeHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");

        // Update reset code and expiry (2 minutes)
        user.resetPasswordToken = hashedResetCode;
        user.resetPasswordExpiresAt = Date.now() + 2 * 60 * 1000;
        await user.save();

        // Send reset code via email
        await sendResetEmail(email, resetCode);

        return res.json({ message: "Reset code resent successfully" });

    } catch (error) {
        console.error("Resend Reset Code error:", error);
        return res.status(500).json({ message: "Internal server error" });
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

//Get the number of total active users
const getTotalActiveUsers = async (req, res) => {
  try {
    const activeUsersCount = await User.countDocuments({ status: "active" });
    res.json({ totalActiveUsers: activeUsersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get totaal inactive users
const getTotalInactiveUsers = async (req, res) => {
  try {
    const inactiveUsersCount = await User.countDocuments({ status: "inactive" });
    res.json({ totalInactiveUsers: inactiveUsersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    loginHandler,
    registerHandler,
    requestPasswordReset,
    resetPassword,
    verifyResetCode,
    verifyLoginHandler,
    resendOtpHandler,
    resendResetCodeHandler,
  // getUserByIdHandler,
    getTotalActiveUsers,
    getTotalInactiveUsers,
};