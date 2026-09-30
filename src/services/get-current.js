export async function getCurrent({ value }) {
  const API_URL = process.env.OPENWEATHER_API_URL;
  const API_KEY = process.env.API_KEY;

  if (!API_URL) {
    throw new Error("OPENWEATHER_API_URL is not defined");
  }

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  if (!value?.trim()) {
    throw new Error("Location value is required");
  }

  const location = encodeURIComponent(value.trim());

  try {
    const geoResponse = await fetch(
      `${API_URL}/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`,
    );

    if (!geoResponse.ok) {
      throw new Error("GEOCODING_FAILED");
    }

    const locations = await geoResponse.json();

    if (!locations.length) {
      throw new Error("LOCATION_NOT_FOUND");
    }

    const { lat, lon } = locations[0];

    const weatherResponse = await fetch(
      `${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );

    if (!weatherResponse.ok) {
      throw new Error("WEATHER_REQUEST_FAILED");
    }

    return await weatherResponse.json();
  } catch (error) {
    console.error("getCurrent error:", error);
    throw error;
  }
}
