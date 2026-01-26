export async function getWeather(latitude, longitude) {
  const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  const url = new URL(API_BASE_URL);
  url.searchParams.append('latitude', latitude);
  url.searchParams.append('longitude', longitude);
  url.searchParams.append('current_weather', 'true');
  url.searchParams.append('hourly', 'temperature_2m');
  url.searchParams.append('forecast_days', '1'); // Fetch for 1 day

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }
  return response.json();
}