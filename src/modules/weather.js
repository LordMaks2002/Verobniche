export async function getWeather(latitude, longitude) {
  // Construct the URL to call the Cloudflare Worker proxy
  // The worker will then reconstruct the Open-Meteo URL
  const workerUrl = `/api/weather?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&forecast_days=1`;

  try {
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch weather data:", error);
    return null;
  }
}
