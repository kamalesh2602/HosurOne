import config from '../config/env.js';
import { translateWeatherCode } from '../utils/weatherCodes.js';

// In-memory cache to prevent excessive external requests
let cachedWeather = null;
let cacheExpiresAt = 0;

/**
 * Service to fetch and transform weather data from Open-Meteo
 */
export async function getHosurWeather(forceRefresh = false) {
  const now = Date.now();

  // Return cached data if still valid and not forcing a refresh
  if (!forceRefresh && cachedWeather && now < cacheExpiresAt) {
    return {
      ...cachedWeather,
      cached: true,
      cacheRemainingSeconds: Math.round((cacheExpiresAt - now) / 1000),
    };
  }

  const { latitude, longitude, requestTimeoutMs, cacheDurationMs } = config.weather;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum'
  );
  url.searchParams.set('timezone', 'Asia/Kolkata');
  url.searchParams.set('forecast_days', '5');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HosurOne-CivicPortal/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}: ${response.statusText}`);
    }

    const raw = await response.json();

    if (!raw.current) {
      throw new Error('Malformed response from weather provider: missing current weather telemetry.');
    }

    // Format current weather metrics
    const current = {
      temperature: raw.current.temperature_2m,
      feelsLike: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      precipitation: raw.current.precipitation,
      windSpeed: raw.current.wind_speed_10m,
      weatherCode: raw.current.weather_code,
      condition: translateWeatherCode(raw.current.weather_code),
      time: raw.current.time,
      units: {
        temperature: raw.current_units?.temperature_2m || '°C',
        feelsLike: raw.current_units?.apparent_temperature || '°C',
        humidity: raw.current_units?.relative_humidity_2m || '%',
        precipitation: raw.current_units?.precipitation || 'mm',
        windSpeed: raw.current_units?.wind_speed_10m || 'km/h',
      },
    };

    // Format upcoming daily forecast
    const forecast = [];
    if (raw.daily && Array.isArray(raw.daily.time)) {
      for (let i = 0; i < raw.daily.time.length; i++) {
        forecast.push({
          date: raw.daily.time[i],
          maxTemp: raw.daily.temperature_2m_max[i],
          minTemp: raw.daily.temperature_2m_min[i],
          precipitation: raw.daily.precipitation_sum ? raw.daily.precipitation_sum[i] : 0,
          weatherCode: raw.daily.weather_code[i],
          condition: translateWeatherCode(raw.daily.weather_code[i]),
        });
      }
    }

    const transformedData = {
      location: {
        name: 'Hosur',
        region: 'Krishnagiri District, Tamil Nadu',
        state: 'Tamil Nadu',
        country: 'India',
        coordinates: {
          latitude: raw.latitude || latitude,
          longitude: raw.longitude || longitude,
        },
        elevation: raw.elevation || 862,
        timezone: raw.timezone || 'Asia/Kolkata',
      },
      current,
      forecast,
      provider: config.weather.provider,
      updatedAt: new Date().toISOString(),
      cached: false,
    };

    // Store in memory cache
    cachedWeather = transformedData;
    cacheExpiresAt = now + cacheDurationMs;

    return transformedData;
  } catch (error) {
    clearTimeout(timeoutId);

    // If external call fails, but we have an existing cache (even if expired), return stale cache with flag
    if (cachedWeather) {
      console.warn(`[Weather Service Warning] External provider failed (${error.message}). Serving stale cache.`);
      return {
        ...cachedWeather,
        cached: true,
        stale: true,
        warning: 'Weather data served from temporary fallback cache due to external provider connectivity issue.',
      };
    }

    if (error.name === 'AbortError') {
      const timeoutError = new Error('Weather provider connection timed out.');
      timeoutError.status = 504;
      throw timeoutError;
    }

    throw error;
  }
}

export default { getHosurWeather };

