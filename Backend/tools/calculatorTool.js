export const calculatorTool = (mathText) => {
  try {
    const safeMathText = mathText.replace(/[^0-9+\-*/(). ]/g, '');

    const answer = Function(`"use strict"; return (${safeMathText})`)();

    return String(answer);
  } catch (error) {
    return 'Calculator could not solve that.';
  }
};
