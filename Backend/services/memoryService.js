// Backend/services/memoryService.js
import OpenAI from 'openai';
import memoryModel from '../models/memoryModel.js';

let openaiClient = null;

const getOpenAIClient = () => {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
};

export const extractMemory = async (message) => {
  const openai = getOpenAIClient();

  if (!openai) {
    return {
      shouldSave: false,
      category: null,
      memory: null,
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        {
          role: 'system',
          content: `
Extract long-term user facts.

Return ONLY JSON.

If memory should be saved:
{
  "shouldSave": true,
  "category": "identity",
  "memory": "User's name is Sunny G."
}

Allowed categories:
identity
preference
project
skill
general

Name examples:
"My name is Sunny G" -> {
  "shouldSave": true,
  "category": "identity",
  "memory": "User's name is Sunny G."
}

"Sunny G is my name" -> {
  "shouldSave": true,
  "category": "identity",
  "memory": "User's name is Sunny G."
}

"I am Sunny G" -> {
  "shouldSave": true,
  "category": "identity",
  "memory": "User's name is Sunny G."
}

If nothing useful should be saved:
{
  "shouldSave": false,
  "category": null,
  "memory": null
}
        `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const rawContent = response.choices?.[0]?.message?.content || '{}';
    return JSON.parse(rawContent);
  } catch {
    return {
      shouldSave: false,
      category: null,
      memory: null,
    };
  }
};

export const saveMemory = async (sessionId, memoryObject) => {
  if (!memoryObject?.shouldSave) return;

  const cleanMemory = memoryObject.memory.trim();
  const category = memoryObject.category || 'general';

  try {
    if (category === 'identity') {
      await memoryModel.deleteMany({
        sessionId,
        category: 'identity',
      });
    }

    const existingMemory = await memoryModel.findOne({
      sessionId,
      memory: cleanMemory,
    });

    if (existingMemory) return;

    await memoryModel.create({
      sessionId,
      category,
      memory: cleanMemory,
    });
  } catch (error) {
    console.error('saveMemory error:', error);
  }
};

export const getMemories = async (sessionId) => {
  const memories = await memoryModel
    .find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(10);

  return memories.map((item) => `- ${item.memory}`).join('\n');
};
