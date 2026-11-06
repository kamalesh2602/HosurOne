import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

// WMO Weather interpretation code helper
function getWeatherDescription(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy / Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Scattered Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Fair Weather';
}

export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Hosur Coordinates: 12.7409° N, 77.8253° E
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=12.7409&longitude=77.8253&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata',
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Weather service returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && json.current) {
        setWeatherData(json.current);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('Malformed weather response');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to connect to automated weather station feed.');
      } else {
        setError('Connection timed out while fetching weather telemetry.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const metrics = [
    {
      id: 'temp',
      label: 'Ambient Temperature',
      value: weatherData ? `${weatherData.temperature_2m} °C` : '-- °C',
      sublabel: weatherData ? getWeatherDescription(weatherData.weather_code) : 'Pending live feed',
      icon: Thermometer,
      iconColor: 'text-amber-700 bg-amber-50',
    },
    {
      id: 'feels_like',
      label: 'Heat Index / Feels Like',
      value: weatherData ? `${weatherData.apparent_temperature} °C` : '-- °C',
      sublabel: weatherData ? 'Real-feel index' : 'Awaiting sensor stream',
      icon: CloudSun,
      iconColor: 'text-orange-700 bg-orange-50',
    },
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: weatherData ? `${weatherData.relative_humidity_2m} %` : '-- %',
      sublabel: weatherData ? 'Atmospheric moisture' : 'Awaiting hygrometer data',
      icon: Droplets,
      iconColor: 'text-sky-700 bg-sky-50',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: weatherData ? `${weatherData.wind_speed_10m} km/h` : '-- km/h',
      sublabel: weatherData ? 'Surface anemometer' : 'Anemometer feed pending',
      icon: Wind,
      iconColor: 'text-teal-700 bg-teal-50',
    },
    {
      id: 'rainfall',
      label: 'Precipitation',
      value: weatherData ? `${weatherData.precipitation} mm` : '-- mm',
      sublabel: weatherData ? 'Current precipitation' : 'Rainfall telemetry offline',
      icon: CloudRain,
      iconColor: 'text-indigo-700 bg-indigo-50',
    },
    {
      id: 'elevation',
      label: 'Station Elevation',
      value: '~862 m',
      sublabel: 'Deccan Plateau ridge',
      icon: Gauge,
      iconColor: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Hosur Live"
          title="Regional Weather & Climate"
          subtitle="Real-time environmental telemetry and atmospheric conditions for the Hosur plateau region."
        />

        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          {/* Header with location and station status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900">Hosur Regional Weather Station</h3>
                {weatherData ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live Telemetry Active
                  </span>
                ) : loading ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-spin" />
                    Connecting to Station...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Feed Offline
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Krishnagiri District, Tamil Nadu • 12.7409° N, 77.8253° E • Elevation ~862m (2,828 ft)
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-stone-500 hidden sm:inline">
                  Updated: {lastUpdated}
                </span>
              )}
              <button
                type="button"
                onClick={fetchWeatherData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer border border-stone-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh Feed'}</span>
              </button>
            </div>
          </div>

          {/* Error fallback notice if connection fails */}
          {error && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">
                  Live telemetry temporarily unavailable
                </p>
                <p className="text-amber-800/95 text-xs leading-relaxed">
                  {error}. HosurOne does not fabricate weather data. Please click "Refresh Feed" or check back shortly.
                </p>
              </div>
            </div>
          )}

          {/* Success telemetry attribution */}
          {weatherData && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Real-time observation:</strong> Currently {getWeatherDescription(weatherData.weather_code)} across the Hosur plateau region.
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium">Source: Open-Meteo AWS Telemetry</span>
            </div>
          )}

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {metrics.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <div className={`p-1.5 rounded-lg ${item.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-stone-900 font-mono tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Climate context */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-500">
            <span>
              <strong>Regional climate profile:</strong> Hosur experiences a semi-arid, pleasant plateau climate characterized by cooler temperatures compared to the lower plains of Tamil Nadu.
            </span>
            <span className="text-stone-400 shrink-0">Coordinates: 12.7409° N, 77.8253° E</span>
          </div>
        </div>
      </div>
    </section>
  );
}
