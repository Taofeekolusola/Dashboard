const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
        },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    bvn: {
      type: String,
      required: true,
      unique: true,
    },
    kyc: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);