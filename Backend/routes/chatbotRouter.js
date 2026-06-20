// Backend/routes/chatbotRouter.js
import express from 'express';
import {
	getchatbotresponse,
	getchatsessions,
} from '../controllers/chatbotController.js';

const chatbotRouter = express.Router();

chatbotRouter.post('/chat-away', getchatbotresponse);
chatbotRouter.get('/sessions', getchatsessions);

export default chatbotRouter;
