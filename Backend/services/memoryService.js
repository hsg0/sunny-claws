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

export const saveMemory = async (sessionId, memoryText) => {
  if (!memoryText || memoryText.trim() === '') return;

  await memoryModel.create({
    sessionId,
    memory: memoryText.trim(),
  });
};

export const getMemories = async (sessionId) => {
  const memories = await memoryModel
    .find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(10);

  return memories
    .reverse()
    .map((item) => `- ${item.memory}`)
    .join('\n');
};

export const extractMemory = async (message) => {
  const openai = getOpenAIClient();

  if (!openai) {
    return 'NONE';
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Extract important long-term facts.

Examples:

"My name is Sunny"
→ "User's name is Sunny"

"I live in Vancouver"
→ "User lives in Vancouver"

"I like Next.js"
→ "User likes Next.js"

If nothing should be remembered, return:

NONE

Return only the memory text.
        `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const memoryText = response.choices?.[0]?.message?.content?.trim();
    return memoryText || 'NONE';
  } catch {
    return 'NONE';
  }
};
