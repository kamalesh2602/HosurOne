import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env relative to backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cacheTtlSeconds = parseInt(process.env.WEATHER_CACHE_TTL || '600', 10);

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || '',
  weather: {
    provider: process.env.WEATHER_PROVIDER || 'openmeteo',
    latitude: parseFloat(process.env.WEATHER_LAT || '12.7409'),
    longitude: parseFloat(process.env.WEATHER_LON || '77.8253'),
    cacheDurationMs: (Number.isNaN(cacheTtlSeconds) ? 600 : cacheTtlSeconds) * 1000,
    requestTimeoutMs: 8000,
  },
};

// Validation warnings (non-fatal for optional variables)
if (Number.isNaN(config.weather.latitude) || Number.isNaN(config.weather.longitude)) {
  console.warn('[Config Warning] Invalid WEATHER_LAT or WEATHER_LON. Falling back to Hosur coordinates (12.7409, 77.8253).');
  config.weather.latitude = 12.7409;
  config.weather.longitude = 77.8253;
}

export default config;
