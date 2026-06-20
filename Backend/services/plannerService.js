import OpenAI from 'openai';

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

export const createPlan = async (userMessage) => {
  const openai = getOpenAIClient();

  if (!openai) {
    return {
      goal: 'Respond to user request',
      steps: ['Read message', 'Provide best possible response'],
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        {
          role: 'system',
          content: `
You are an AI planner.

Return ONLY JSON.

Example:

{
  "goal": "Get weather",
  "steps": [
    "Find city",
    "Call weather tool",
    "Summarize weather"
  ]
}
        `,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const rawContent = response.choices?.[0]?.message?.content || '{}';
    return JSON.parse(rawContent);
  } catch {
    return {
      goal: 'Respond to user request',
      steps: ['Read message', 'Provide best possible response'],
    };
  }
};