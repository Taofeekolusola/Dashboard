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
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,     
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('User', userSchema);