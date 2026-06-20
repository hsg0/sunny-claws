// Backend/tools/webSearchTool.js
export const runWebSearchTool = async (query) => {
  const text = String(query || '').trim();

  if (!text) {
    return 'No search query provided.';
  }

  // Placeholder until a real search API is connected.
  return `Search results for \"${text}\": feature not connected yet.`;
};
