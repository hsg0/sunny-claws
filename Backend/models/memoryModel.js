// Backend/models/memoryModel.js
import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    memory: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

const memoryModel = mongoose.model('Memory', memorySchema);

export default memoryModel;
