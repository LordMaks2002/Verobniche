import './style.css';
import { initClock } from './modules/clock.js';
import { getWeather } from './modules/weather_client.js';
import { handleAuthClick, handleSignoutClick } from './modules/calendar.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Personal Planner</h1>
    <div id="live-clock"></div>
    <div id="weather"></div>
    
    <h2>Calendar</h2>
    <button id="authorize_button" style="visibility: hidden">Authorize</button>
    <button id="signout_button" style="visibility: hidden">Sign Out</button>
    <div id="calendar"></div>
  </div>
`;

initClock('live-clock');

async function showWeather() {
  const weatherElement = document.querySelector('#weather');
  weatherElement.innerHTML = '<p>Loading weather...</p>';

  const lat = 50.45;
  const lon = 30.52;

  const weatherData = await getWeather(lat, lon);

  if (weatherData) {
    const { current_weather, hourly } = weatherData;
    const now = new Date();
    const currentHour = now.getHours();

    const hourlyIndex = hourly.time.findIndex(t => new Date(t).getHours() === currentHour);

    let forecastHtml = '<h2>Weather</h2>';
    forecastHtml += `<p>Current Temperature: ${current_weather.temperature}°C</p>`;
    forecastHtml += '<h3>12-Hour Forecast</h3><ul>';

    if (hourlyIndex !== -1) {
      for (let i = 0; i < 12; i++) {
        const forecastIndex = hourlyIndex + i;
        if (forecastIndex < hourly.time.length) {
          const time = new Date(hourly.time[forecastIndex]);
          const temp = hourly.temperature_2m[forecastIndex];
          forecastHtml += `<li>${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${temp}°C</li>`;
        }
      }
    }

    forecastHtml += '</ul>';
    weatherElement.innerHTML = forecastHtml;
  } else {
    weatherElement.innerHTML = '<p>Could not load weather data. The service may be temporarily unavailable.</p>';
  }
}

showWeather();

document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
document.getElementById('signout_button').addEventListener('click', handleSignoutClick);
