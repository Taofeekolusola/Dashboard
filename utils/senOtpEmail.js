const nodemailer = require("nodemailer");


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


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It expires in 2 minutes.`
    });
};

// Function to send OTP email
const sendResetEmail = async (email, resetCode) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your reset Code is resent",
        text: `Your OTP code is: ${resetCode}. It expires in 2 minutes.`
    });
};

module.exports = {
    sendOtpEmail,
    sendEmail,
    sendResetEmail,
 } ;