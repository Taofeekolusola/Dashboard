const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    investmentName: {
        type: String,
        required: true,
    },
    investmentType: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    amountInvested: {
        type: Number,
        required: true,
        default: 0,
    },
    expectedReturn: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['matured', 'completed', 'cancelled'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
    },
    maturityDate: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('Investment', investmentSchema);