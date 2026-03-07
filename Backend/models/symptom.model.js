import mongoose from 'mongoose';

export const SYMPTOM_CATEGORIES = [
  'Respiratory',
  'General',
  'Digestive',
  'Skin',
  'Head & Neck',
  'Cardiovascular',
  'Neurological',
  'Musculoskeletal',
  'Custom',
  'Other',
];

const symptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: SYMPTOM_CATEGORIES,
      trim: true,
    },
  },
  { timestamps: true }
);

symptomSchema.index({ name: 1 });

const Symptom = mongoose.model('Symptom', symptomSchema);

export default Symptom;

