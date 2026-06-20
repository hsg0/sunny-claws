// Backend/services/toolService.js
import { availableTools } from '../tools/toolRegistry.js';

export const runSelectedTool = async (toolName, toolInput) => {
  const selectedTool = availableTools.find((tool) => tool.name === toolName);

  if (!selectedTool) {
    return {
      usedTool: false,
      toolName,
      toolAnswer: 'Tool not found.',
    };
  }

  const toolAnswer = await selectedTool.execute(toolInput);

  return {
    usedTool: true,
    toolName: selectedTool.name,
    toolAnswer,
  };
};
