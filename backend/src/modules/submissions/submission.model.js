import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['new_place', 'correction'],
      default: 'new_place',
      index: true,
    },
    targetListingId: {
      type: String,
      trim: true,
    },
    targetListingName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    submittedBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'needs_information', 'approved', 'rejected', 'published', 'unpublished'],
      default: 'pending',
      index: true,
    },
    moderation: {
      reviewedBy: { type: String },
      reviewedAt: { type: String },
      feedbackReason: { type: String },
      notes: { type: String },
    },
    isDuplicateWarning: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Submission =
  mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

export default Submission;

