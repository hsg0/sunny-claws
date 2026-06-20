import { calculatorTool } from './calculatorTool.js';
import { weatherTool } from './weatherTool.js';

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
];
