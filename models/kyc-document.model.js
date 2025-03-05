const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const kycDocumentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['NIN', 'Passport', 'Driver_license', 'Voter_card'],
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KycDocument', kycDocumentSchema);