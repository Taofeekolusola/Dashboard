const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    transactionType: {
        type: String,
        enum: ['deposit', 'withdrawal', 'interest'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    transactionDate: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('Transaction', transactionSchema);