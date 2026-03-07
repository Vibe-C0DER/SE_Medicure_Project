import mongoose from 'mongoose';

const { Schema } = mongoose;

export const DISEASE_SEVERITIES = ['Low', 'Moderate', 'High'];

const diseaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    symptoms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Symptom',
        required: true,
      },
    ],
    precautions: {
      type: [String],
      default: [],
    },
    treatments: {
      type: [String],
      default: [],
    },
    severity: {
      type: String,
      enum: DISEASE_SEVERITIES,
      default: 'Low',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
diseaseSchema.index({ name: 1 });
diseaseSchema.index({ symptoms: 1 });

const Disease = mongoose.model('Disease', diseaseSchema);

export default Disease;

