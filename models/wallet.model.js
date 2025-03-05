const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const walletSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);