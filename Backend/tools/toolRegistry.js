import { calculatorTool } from './calculatorTool.js';
import { weatherTool } from './weatherTool.js';
import { webSearchTool } from './webSearchTool.js';
import { emailTool } from './emailTool.js';

export const availableTools = [
  {
    name: 'calculator',
    description: 'Use this tool when the user asks for math or calculations.',
    execute: calculatorTool,
  },
  {
    name: 'weather',
    description: 'Use this tool when the user asks about weather in a city.',
    execute: weatherTool,
  },
  {
    name: 'webSearch',
    description:
      'Use this tool when the user asks for current information, facts, news, definitions, or information that may need lookup.',
    execute: webSearchTool,
  },
  {
    name: 'email',
    description:
      'Use this tool when the user asks to write, draft, or send an email. Input must be an object with to, subject, and body.',
    execute: emailTool,
  },
];
