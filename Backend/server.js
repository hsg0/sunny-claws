// Backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatbotRouter from './routes/chatbotRouter.js';
import { connectToMongoDB } from './config/mongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5020;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use('/web/chatbot', chatbotRouter);

const startServer = async () => {
  try {
    await connectToMongoDB();

    app.listen(PORT, 'localhost', () => {
      console.log(`Server is running on localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();