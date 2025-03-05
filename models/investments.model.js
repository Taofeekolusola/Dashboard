const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const investmentSchema = new Schema(
  {
    walletId: {
      type: Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["Fixed Deposit", "Real Estate", "Stocks"],
      required: true,
    },
    amountInvested: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    returnsExpected: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Withdrawn"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);