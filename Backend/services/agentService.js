import { askSunnyClaw, chooseToolWithAI } from './openaiService.js';
import { runSelectedTool } from './toolService.js';
import { createPlan } from './plannerService.js';

const MAX_AGENT_STEPS = 2;

export const runSunnyClawAgent = async (userMessage, memoryText) => {
  try {
    let plan = {
      goal: 'Respond to user request',
      steps: ['Read message', 'Provide best possible response'],
    };

    try {
      plan = await createPlan(userMessage);
    } catch (error) {
      console.error('AGENT PLAN ERROR:', error);
    }

    console.log('PLAN');
    console.log(plan);

    const toolResults = [];

    for (let step = 1; step <= MAX_AGENT_STEPS; step++) {
      try {
        const toolChoice = await chooseToolWithAI(userMessage);

        if (!toolChoice.useTool) {
          break;
        }

        const toolResult = await runSelectedTool(
          toolChoice.toolName,
          toolChoice.toolInput
        );

        toolResults.push({
          step,
          toolChoice,
          toolResult,
        });

        break;
      } catch (error) {
        console.error(`AGENT STEP ${step} ERROR:`, error);
        break;
      }
    }

    let finalReply = 'I understand. You said: "' + userMessage + '".';

    try {
      finalReply = await askSunnyClaw(
        userMessage,
        memoryText,
        toolResults
      );
    } catch (error) {
      console.error('AGENT FINAL REPLY ERROR:', error);
    }

    return {
      reply: finalReply,
      agentSteps: toolResults,
    };
  } catch (error) {
    console.error('runSunnyClawAgent fatal error:', error);
    return {
      reply: 'Sunny-Claw had a temporary issue while processing your request.',
      agentSteps: [],
    };
  }
};