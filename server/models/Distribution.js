import mongoose from 'mongoose';

const distributionSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListItem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Distribution = mongoose.model('Distribution', distributionSchema);

export default Distribution;