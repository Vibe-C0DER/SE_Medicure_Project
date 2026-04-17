import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    riskFactors: {
      type: String,
    },
    prevention: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    disease: {
      type: Schema.Types.ObjectId,
      ref: 'Disease',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

articleSchema.index({ disease: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
