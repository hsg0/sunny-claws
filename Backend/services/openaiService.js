// Backend/services/openaiService.js
import OpenAI from 'openai';
import agentSoul from '../config/agentSoul.js';
import { availableTools } from '../tools/toolRegistry.js';

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

export const chooseToolWithAI = async (userMessage) => {
  const openai = getOpenAIClient();

  if (!openai) {
    return {
      useTool: false,
      toolName: null,
      toolInput: null,
    };
  }

  const toolList = availableTools
    .map((tool) => `${tool.name}: ${tool.description}`)
    .join('\n');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        {
          role: 'system',
          content: `
You are Sunny-Claw's tool chooser.

Your only job is to decide if the user's message needs a tool.

Available tools:
${toolList}

Important rules:
- If the user asks about math, use calculator.
- If the user asks about weather, forecast, temperature, rain, snow, or city weather, use weather.
- If the user asks for current facts, latest information, definitions, news, or asks you to look something up, use webSearch.
- Fix small spelling mistakes if the meaning is clear.
- If the user types "vancovuer", understand it as "Vancouver".
- Return ONLY JSON.
- Do not explain.

If a tool is needed:
{
  "useTool": true,
  "toolName": "weather",
  "toolInput": "Vancouver"
}

For lookups and current facts:
{
  "useTool": true,
  "toolName": "webSearch",
  "toolInput": "latest Node.js LTS version"
}

If no tool is needed:
{
  "useTool": false,
  "toolName": null,
  "toolInput": null
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
      useTool: false,
      toolName: null,
      toolInput: null,
    };
  }
};

export const askSunnyClaw = async (userMessage, memoryText, toolResult = null) => {
  const openai = getOpenAIClient();

  if (!openai) {
    if (toolResult?.usedTool) {
      return `I used the ${toolResult.toolName} tool. The answer is: ${toolResult.toolAnswer}`;
    }

    return `I understand. You said: "${userMessage}".`;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-5.5',
    messages: [
      {
        role: 'system',
        content: agentSoul,
      },
      {
        role: 'user',
        content: `
Recent memory:
${memoryText}

User message:
${userMessage}

Tool result:
${toolResult ? JSON.stringify(toolResult) : 'No tool was used.'}
        `,
      },
    ],
  });

  return response.choices?.[0]?.message?.content || `I understand. You said: "${userMessage}".`;
};
