const fetchJsonWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const webSearchTool = async (searchText) => {
  try {
    const safeSearchText = String(searchText || '').trim();

    if (!safeSearchText) {
      return 'Please provide something to search for.';
    }

    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      safeSearchText
    )}&format=json&no_html=1&skip_disambig=1`;

    const data = await fetchJsonWithTimeout(searchUrl);

    if (data.AbstractText) {
      return data.AbstractText;
    }

    if (data.Answer) {
      return data.Answer;
    }

    if (data.RelatedTopics?.length > 0) {
      const firstResult = data.RelatedTopics[0];

      if (firstResult.Text) {
        return firstResult.Text;
      }
    }

    return `I searched for "${safeSearchText}", but I could not find a clear instant answer.`;
  } catch (error) {
    console.log('WEB SEARCH TOOL ERROR');
    console.log(error);

    return 'The web search tool could not reach the search service right now.';
  }
};
