const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        status: {
          type: String,
          enum: ['active', 'inactive', 'cancelled'],
          default: 'active',
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

module.exports = mongoose.model('Admin', adminSchema);