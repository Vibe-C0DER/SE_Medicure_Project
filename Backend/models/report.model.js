import mongoose from 'mongoose';

const { Schema } = mongoose;

const predictionEntrySchema = new Schema(
  {
    disease: {
      type: Schema.Types.ObjectId,
      ref: 'Disease',
      required: true,
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedSymptoms: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSymptoms: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const reportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symptoms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Symptom',
        required: true,
      },
    ],
    predictions: {
      type: [predictionEntrySchema],
      default: [],
    },
    topDisease: {
      type: Schema.Types.ObjectId,
      ref: 'Disease',
      required: true,
    },
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
