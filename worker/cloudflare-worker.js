addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const PWA_ORIGIN = 'YOUR_PWA_ORIGIN'; // Replace with the actual domain where your PWA static assets are hosted.
const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const WEATHER_CACHE_NAME = 'weather-cache-v1';

async function handleRequest(request) {
  const url = new URL(request.url);

  // Handle Weather API proxy requests
  if (url.pathname.startsWith('/api/weather')) {
    return handleWeatherRequest(request, url);
  }

  // Handle static PWA asset requests
  return handleStaticAssetRequest(request, url);
}

async function handleWeatherRequest(request, url) {
  const cache = caches.default;
  const cacheKey = new Request(url.toString()); // Use the incoming worker URL as cache key

  // Try to find the response in cache
  let response = await cache.match(cacheKey);

  if (!response) {
    // If not in cache, fetch from the actual weather API
    // Reconstruct the weather API URL using query parameters from the worker request
    const weatherApiUrl = new URL(WEATHER_API_BASE_URL);
    url.searchParams.forEach((value, key) => {
      weatherApiUrl.searchParams.append(key, value);
    });

    try {
      const apiResponse = await fetch(weatherApiUrl.toString());

      if (!apiResponse.ok) {
        return new Response(`Weather API error: ${apiResponse.statusText}`, { status: apiResponse.status });
      }

      // Clone the response to use it both in the cache and to return to the client
      response = new Response(apiResponse.body, apiResponse);
      response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

      event.waitUntil(cache.put(cacheKey, response.clone())); // Cache the response
    } catch (error) {
      console.error("Error fetching weather from external API:", error);
      return new Response("Error fetching weather data.", { status: 500 });
    }
  }

  // Add security headers to the weather API response as well
  addSecurityHeaders(response);
  return response;
}

async function handleStaticAssetRequest(request, url) {
  const response = await fetch(PWA_ORIGIN + url.pathname, request);
  const newResponse = new Response(response.body, response);

  addSecurityHeaders(newResponse);
  return newResponse;
}

function addSecurityHeaders(response) {
  // Add Security Headers
  response.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    `connect-src 'self' https://api.open-meteo.com; ` + // Allow connection to Open-Meteo API through the worker
    "manifest-src 'self';" +
    "frame-ancestors 'none';"
  );
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
}