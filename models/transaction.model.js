const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const transactionSchema = new Schema(
  {
    walletId: {
      type: Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Transfer', 'Payment'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Successful', 'Failed', 'Reversed'],
      default: 'Pending',
    },
    fee: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Card', 'Ussd', 'Wallet', 'Crypto'],
      required: true,
    },
    relatedEntity: {
      type: String,
      enum: ['Savings', 'Investment', 'Insurance'],
      required: true,
    },
    relatedEntityId: {
      type: Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
