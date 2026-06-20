const knownCities = {
  vancouver: {
    name: 'Vancouver',
    latitude: 49.2827,
    longitude: -123.1207,
  },

  surrey: {
    name: 'Surrey',
    latitude: 49.1913,
    longitude: -122.8490,
  },

  'san jose': {
    name: 'San Jose, California',
    latitude: 37.3382,
    longitude: -121.8863,
  },

  jalandhar: {
    name: 'Jalandhar',
    latitude: 31.3260,
    longitude: 75.5762,
  },
};

const fetchJsonWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const findKnownCity = (city) => {
  const lowerCity = city.toLowerCase();

  if (lowerCity.includes('vancouver') || lowerCity.includes('vancovuer')) {
    return knownCities.vancouver;
  }

  if (lowerCity.includes('surrey')) {
    return knownCities.surrey;
  }

  if (lowerCity.includes('san jose')) {
    return knownCities['san jose'];
  }

  if (lowerCity.includes('jalandhar')) {
    return knownCities.jalandhar;
  }

  return null;
};

export const weatherTool = async (city) => {
  try {
    const safeCity = String(city || '').trim();

    if (!safeCity) {
      return 'Please provide a city name for weather lookup.';
    }

    let place = findKnownCity(safeCity);

    if (!place) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(safeCity)}&count=1`;

      const geoData = await fetchJsonWithTimeout(geoUrl);

      place = geoData.results?.[0];

      if (!place) {
        return `I could not find weather for ${safeCity}.`;
      }
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
