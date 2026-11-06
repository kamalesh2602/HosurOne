import mongoose from 'mongoose';

const governmentOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
    pincode: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    website: {
      type: String,
      trim: true,
    },
    sourceUrl: {
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
      enum: ['verified', 'unverified', 'pending'],
      default: 'verified',
    },
    servicesOffered: [
      {
        type: String,
        trim: true,
      },
    ],
    workingHours: {
      type: String,
      trim: true,
      default: 'Monday – Friday: 10:00 AM – 5:45 PM (Excl. Govt Holidays)',
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for robust full-text search
governmentOfficeSchema.index({
  name: 'text',
  department: 'text',
  address: 'text',
  servicesOffered: 'text',
});

export const GovernmentOffice =
  mongoose.models.GovernmentOffice || mongoose.model('GovernmentOffice', governmentOfficeSchema);

export default GovernmentOffice;
