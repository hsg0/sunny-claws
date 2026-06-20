import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: 'New Chat',
    },
  },
  {
    timestamps: true,
  }
);

const chatSessionModel = mongoose.model(
  'ChatSession',
  chatSessionSchema
);

export default chatSessionModel;
