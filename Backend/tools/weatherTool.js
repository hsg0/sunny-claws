export const weatherTool = async (city) => {
  try {
    const cleanCity = city.toLowerCase().includes('vancouver')
      ? 'Vancouver'
      : city;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    const place = geoData.results?.[0];

    if (!place) {
      return `I could not find weather for ${city}.`;
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    return `Current weather in ${place.name}: ${weatherData.current.temperature_2m}°C, wind speed ${weatherData.current.wind_speed_10m} km/h.`;
  } catch (error) {
    return 'The weather tool could not reach the weather service right now.';
  }
};
