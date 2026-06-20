const fetchJsonWithTimeout = async (url, timeoutMs = 8000) => {
  const response = await Promise.race([
    fetch(url),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
    }),
  ]);

  if (!response.ok) {
    throw new Error(`Weather API request failed with status ${response.status}`);
  }

  return response.json();
};

export const weatherTool = async (city) => {
  try {
    const safeCity = String(city || '').trim();

    if (!safeCity) {
      return 'Please provide a city name for weather lookup.';
    }

    const cleanCity = safeCity.toLowerCase().includes('vancouver')
      ? 'Vancouver'
      : safeCity;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1`;

    const geoData = await fetchJsonWithTimeout(geoUrl);

    const place = geoData.results?.[0];

    if (!place) {
      return `I could not find weather for ${safeCity}.`;
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m`;

    const weatherData = await fetchJsonWithTimeout(weatherUrl);

    if (!weatherData.current) {
      throw new Error('Weather API returned no current weather data');
    }

    return `Current weather in ${place.name}: ${weatherData.current.temperature_2m}°C, wind speed ${weatherData.current.wind_speed_10m} km/h.`;
  } catch (error) {
    console.log('WEATHER TOOL ERROR');
    console.log(error);

    return 'The weather tool could not reach the weather service right now.';
  }
};
