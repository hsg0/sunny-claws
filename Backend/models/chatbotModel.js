import mongoose from 'mongoose';

const chatbotMessageSchema = new mongoose.Schema(
	{
		sessionId: {
			type: String,
			required: true,
			default: 'default-chat',
		},

		sender: {
			type: String,
			required: true,
			enum: ['user', 'assistant'],
		},

		message: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const chatbotMessageModel = mongoose.model(
	'ChatbotMessage',
	chatbotMessageSchema
);

export default chatbotMessageModel;
