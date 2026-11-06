import mongoose from 'mongoose';

const bankBranchSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ifsc: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    micr: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      default: 'Hosur',
      trim: true,
    },
    district: {
      type: String,
      default: 'Krishnagiri',
      trim: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    officialSource: {
      type: String,
      required: true,
      trim: true,
    },
    lastVerified: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'unverified'],
      default: 'verified',
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast search across Bank Name, Branch Name, Address, and IFSC
bankBranchSchema.index({
  bankName: 'text',
  branchName: 'text',
  ifsc: 'text',
  address: 'text',
  locality: 'text',
});

export const BankBranch =
  mongoose.models.BankBranch || mongoose.model('BankBranch', bankBranchSchema);

export default BankBranch;
