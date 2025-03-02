const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    amountSaved: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed'],
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

module.exports = mongoose.model('Savings', savingsSchema);