const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const savingsPlanSchema = new Schema(
  {
    walletId: {
      type: Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    amountSaved: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Cancelled"],
      default: "Ongoing",
    },
    startDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('SavingsPlan', savingsPlanSchema);