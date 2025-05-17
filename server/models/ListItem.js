import mongoose from 'mongoose';

const listItemSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
    },
    distribution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Distribution',
    },
  },
  {
    timestamps: true,
  }
);

const ListItem = mongoose.model('ListItem', listItemSchema);

export default ListItem;