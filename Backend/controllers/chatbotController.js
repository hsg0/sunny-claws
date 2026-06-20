import chatbotMessageModel from '../models/chatbotModel.js';
import chatSessionModel from '../models/chatSessionModel.js';
import { askSunnyClaw, chooseToolWithAI } from '../services/openaiService.js';
import { saveMemory, getMemories, extractMemory } from '../services/memoryService.js';
import { runSelectedTool } from '../services/toolService.js';

export const getchatsessions = async (req, res) => {
  try {
    const sessions = await chatSessionModel
      .find({})
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Get sessions error:', error);

    res.status(500).json({
      success: false,
      sessions: [],
    });
  }
};

export const getchatbotresponse = async (req, res) => {
  try {
    const message = req.body.message;
    const sessionId = req.body.sessionId || 'main-chat';

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        reply: 'Please send a message.',
      });
    }

    const cleanMessage = message.trim();

    const extractedMemory = await extractMemory(cleanMessage);
    if (extractedMemory !== 'NONE') {
      await saveMemory(sessionId, extractedMemory);
    }

    await chatSessionModel.findOneAndUpdate(
      { sessionId },
      { $setOnInsert: { title: cleanMessage.slice(0, 40) || 'New Chat' } },
      { upsert: true, returnDocument: 'after' }
    );

    await chatbotMessageModel.create({
      sessionId,
      sender: 'user',
      message: cleanMessage,
    });

    const recentMessages = await chatbotMessageModel
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(8);

    const memoryText = recentMessages
      .reverse()
      .map((chat) => `${chat.sender}: ${chat.message}`)
      .join('\n');

    const longTermMemoryText = await getMemories(sessionId);

    const fullMemoryText = `
  Recent chat:
  ${memoryText}

  Long-term memory:
  ${longTermMemoryText || 'No long-term memories yet.'}
  `;

    const toolChoice = await chooseToolWithAI(cleanMessage);

    let toolResult = null;

    if (toolChoice.useTool) {
      toolResult = await runSelectedTool(toolChoice.toolName, toolChoice.toolInput);
    }

    const reply = await askSunnyClaw(cleanMessage, fullMemoryText, toolResult);

    await chatbotMessageModel.create({
      sessionId,
      sender: 'assistant',
      message: reply,
    });

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Chatbot controller error:', error);

    res.status(500).json({
      success: false,
      reply: 'Sunny-Claw had a server problem.',
    });
  }
};