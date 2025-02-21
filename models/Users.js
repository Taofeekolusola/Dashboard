const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ['SuperAdmin', 'FinancialOfficers', "ComplianceOfficers", "FinancialOfficers" ],
          default: 'SuperAdmin',
        },
        profilePicture: {
          type: String,
          default: 'default.png',
        },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    otp: String,
    otpExpires: Date,
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('User', userSchema);