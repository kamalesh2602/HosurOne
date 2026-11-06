import WeatherProvider from './weather.provider.js';
import { translateWeatherCode } from '../../../utils/weatherCodes.js';

export class OpenMeteoProvider extends WeatherProvider {
  constructor() {
    super('openmeteo');
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  /**
   * Fetches current weather and short 5-day outlook
   */
  async getCurrent(latitude, longitude, timeoutMs = 8000) {
    const url = new URL(this.baseUrl);
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

    const raw = await this._fetchWithTimeout(url.toString(), timeoutMs);

    return this._transformCurrent(raw, latitude, longitude);
  }

  /**
   * Fetches detailed weather forecast including 24h hourly and 7-day daily data
   */
  async getForecast(latitude, longitude, timeoutMs = 8000) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m'
    );
    url.searchParams.set(
      'hourly',
      'temperature_2m,precipitation_probability,precipitation,weather_code'
    );
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset'
    );
    url.searchParams.set('timezone', 'Asia/Kolkata');
    url.searchParams.set('forecast_days', '7');

    const raw = await this._fetchWithTimeout(url.toString(), timeoutMs);

    return this._transformFullForecast(raw, latitude, longitude);
  }

  async _fetchWithTimeout(urlString, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(urlString, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HosurOne-CivicPortal/1.0',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo returned status ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      if (!json || !json.current) {
        throw new Error('Malformed payload returned from Open-Meteo API.');
      }
      return json;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Weather provider connection timed out.');
        timeoutError.status = 504;
        throw timeoutError;
      }
      throw error;
    }
  }

  _transformCurrent(raw, defaultLat, defaultLon) {
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

    return {
      location: {
        name: 'Hosur',
        region: 'Krishnagiri District, Tamil Nadu',
        state: 'Tamil Nadu',
        country: 'India',
        coordinates: {
          latitude: raw.latitude || defaultLat,
          longitude: raw.longitude || defaultLon,
        },
        elevation: raw.elevation || 862,
        timezone: raw.timezone || 'Asia/Kolkata',
      },
      current,
      forecast,
      updatedAt: new Date().toISOString(),
    };
  }

  _transformFullForecast(raw, defaultLat, defaultLon) {
    const base = this._transformCurrent(raw, defaultLat, defaultLon);

    // Extract next 24 hourly periods starting from current time
    const hourly = [];
    if (raw.hourly && Array.isArray(raw.hourly.time)) {
      const nowIso = raw.current.time;
      let startIndex = raw.hourly.time.findIndex((t) => t >= nowIso);
      if (startIndex === -1) startIndex = 0;

      const endIndex = Math.min(startIndex + 24, raw.hourly.time.length);
      for (let i = startIndex; i < endIndex; i++) {
        hourly.push({
          time: raw.hourly.time[i],
          temperature: raw.hourly.temperature_2m[i],
          precipitationProbability: raw.hourly.precipitation_probability ? raw.hourly.precipitation_probability[i] : 0,
          precipitation: raw.hourly.precipitation ? raw.hourly.precipitation[i] : 0,
          weatherCode: raw.hourly.weather_code[i],
          condition: translateWeatherCode(raw.hourly.weather_code[i]),
        });
      }
    }

    // Extract 7-day daily forecast with sunrise/sunset
    const daily7Day = [];
    if (raw.daily && Array.isArray(raw.daily.time)) {
      for (let i = 0; i < raw.daily.time.length; i++) {
        daily7Day.push({
          date: raw.daily.time[i],
          maxTemp: raw.daily.temperature_2m_max[i],
          minTemp: raw.daily.temperature_2m_min[i],
          precipitationProbability: raw.daily.precipitation_probability_max ? raw.daily.precipitation_probability_max[i] : 0,
          precipitation: raw.daily.precipitation_sum ? raw.daily.precipitation_sum[i] : 0,
          sunrise: raw.daily.sunrise ? raw.daily.sunrise[i] : null,
          sunset: raw.daily.sunset ? raw.daily.sunset[i] : null,
          weatherCode: raw.daily.weather_code[i],
          condition: translateWeatherCode(raw.daily.weather_code[i]),
        });
      }
    }

    return {
      ...base,
      hourly,
      daily: daily7Day,
      sunrise: raw.daily?.sunrise?.[0] || null,
      sunset: raw.daily?.sunset?.[0] || null,
    };
  }
}

export default OpenMeteoProvider;

