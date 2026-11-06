import config from '../../config/env.js';
import OpenMeteoProvider from './providers/openmeteo.provider.js';

// Factory to select provider based on configuration
function createWeatherProvider() {
  const providerName = (config.weather.provider || 'openmeteo').toLowerCase();
  switch (providerName) {
    case 'openmeteo':
    case 'open-meteo':
    default:
      return new OpenMeteoProvider();
  }
}

const provider = createWeatherProvider();

// In-memory caches
let currentCache = null;
let currentCacheExpiresAt = 0;

let forecastCache = null;
let forecastCacheExpiresAt = 0;

/**
 * Get current weather summary for Hosur
 */
export async function getCurrentWeather(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && currentCache && now < currentCacheExpiresAt) {
    return {
      ...currentCache,
      cached: true,
      cacheRemainingSeconds: Math.round((currentCacheExpiresAt - now) / 1000),
    };
  }

  const { latitude, longitude, requestTimeoutMs, cacheDurationMs } = config.weather;

  try {
    const data = await provider.getCurrent(latitude, longitude, requestTimeoutMs);
    currentCache = data;
    currentCacheExpiresAt = now + cacheDurationMs;

    return {
      ...data,
      cached: false,
    };
  } catch (error) {
    if (currentCache) {
      console.warn(`[Weather Service Warning] Provider error (${error.message}). Serving stale current weather cache.`);
      return {
        ...currentCache,
        cached: true,
        stale: true,
        warning: 'Weather data served from temporary fallback cache due to external provider connectivity issue.',
      };
    }
    throw error;
  }
}

/**
 * Get detailed weather forecast (hourly + 7-day daily) for Hosur
 */
export async function getWeatherForecast(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && forecastCache && now < forecastCacheExpiresAt) {
    return {
      ...forecastCache,
      cached: true,
      cacheRemainingSeconds: Math.round((forecastCacheExpiresAt - now) / 1000),
    };
  }

  const { latitude, longitude, requestTimeoutMs, cacheDurationMs } = config.weather;

  try {
    const data = await provider.getForecast(latitude, longitude, requestTimeoutMs);
    forecastCache = data;
    forecastCacheExpiresAt = now + cacheDurationMs;

    return {
      ...data,
      cached: false,
    };
  } catch (error) {
    if (forecastCache) {
      console.warn(`[Weather Service Warning] Provider error (${error.message}). Serving stale forecast cache.`);
      return {
        ...forecastCache,
        cached: true,
        stale: true,
        warning: 'Forecast data served from temporary fallback cache due to external provider connectivity issue.',
      };
    }
    throw error;
  }
}

export default { getCurrentWeather, getWeatherForecast };
