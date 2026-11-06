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
  CalendarDays,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { fetchHosurWeather } from '../../services/weatherApi';

export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const data = await fetchHosurWeather({
        refresh: isManualRefresh,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setWeatherData(data);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Weather telemetry request timed out. Please check your network connection.');
      } else {
        setError(err.message || 'Unable to retrieve weather data from HosurOne backend service.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(false);
  }, [loadWeather]);

  // Format date string to readable day name (e.g., "Saturday")
  const formatDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatLastUpdated = (isoString) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  const current = weatherData?.current;
  const location = weatherData?.location;
  const forecast = weatherData?.forecast || [];

  const metrics = [
    {
      id: 'temp',
      label: 'Ambient Temperature',
      value: current ? `${current.temperature} ${current.units.temperature}` : '-- °C',
      sublabel: current ? current.condition : 'Awaiting feed',
      icon: Thermometer,
      iconColor: 'text-amber-700 bg-amber-50',
    },
    {
      id: 'feels_like',
      label: 'Heat Index / Feels Like',
      value: current ? `${current.feelsLike} ${current.units.feelsLike}` : '-- °C',
      sublabel: current ? 'Real-feel index' : 'Awaiting sensor stream',
      icon: CloudSun,
      iconColor: 'text-orange-700 bg-orange-50',
    },
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: current ? `${current.humidity} ${current.units.humidity}` : '-- %',
      sublabel: current ? 'Atmospheric moisture' : 'Awaiting hygrometer data',
      icon: Droplets,
      iconColor: 'text-sky-700 bg-sky-50',
    },
    {
      id: 'wind',
      label: 'Surface Wind Speed',
      value: current ? `${current.windSpeed} ${current.units.windSpeed}` : '-- km/h',
      sublabel: current ? 'Surface anemometer' : 'Anemometer feed pending',
      icon: Wind,
      iconColor: 'text-teal-700 bg-teal-50',
    },
    {
      id: 'rainfall',
      label: 'Precipitation',
      value: current ? `${current.precipitation} ${current.units.precipitation}` : '-- mm',
      sublabel: current ? 'Current precipitation' : 'Rainfall gauge offline',
      icon: CloudRain,
      iconColor: 'text-indigo-700 bg-indigo-50',
    },
    {
      id: 'elevation',
      label: 'Station Elevation',
      value: location ? `~${location.elevation} m` : '~862 m',
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
                    Station Offline
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {location
                  ? `${location.region} • ${location.coordinates.latitude.toFixed(4)}° N, ${location.coordinates.longitude.toFixed(4)}° E • Elevation ~${location.elevation}m`
                  : 'Krishnagiri District, Tamil Nadu • 12.7409° N, 77.8253° E • Elevation ~862m'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {weatherData?.updatedAt && (
                <span className="text-xs text-stone-500 hidden sm:inline">
                  Updated: {formatLastUpdated(weatherData.updatedAt)}
                  {weatherData.cached && (
                    <span className="ml-1 text-stone-400 font-mono">(cached)</span>
                  )}
                </span>
              )}
              <button
                type="button"
                onClick={() => loadWeather(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer border border-stone-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading || refreshing ? 'animate-spin' : ''}`}
                />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
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
                  {error}. HosurOne does not fabricate weather data. Please click "Refresh Feed" or ensure the backend service is running.
                </p>
              </div>
            </div>
          )}

          {/* Success telemetry attribution */}
          {weatherData && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Current Observation:</strong> {current.condition} across Hosur region ({current.temperature} {current.units.temperature}, feels like {current.feelsLike} {current.units.feelsLike}).
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium shrink-0">
                Provider: {weatherData.provider}
              </span>
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
                      {loading ? (
                        <span className="inline-block w-16 h-7 bg-stone-200 animate-pulse rounded" />
                      ) : (
                        item.value
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      {loading ? 'Reading sensor...' : item.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5-Day Forecast Strip (Only shown when real forecast data is available) */}
          {forecast.length > 0 && (
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                <CalendarDays className="w-4 h-4 text-emerald-800" />
                <span>5-Day Weather Outlook</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {forecast.map((f, idx) => (
                  <div
                    key={f.date}
                    className="p-3 rounded-xl border border-stone-200/70 bg-stone-50/40 text-center space-y-1.5"
                  >
                    <div className="text-xs font-bold text-stone-800">
                      {formatDayName(f.date, idx)}
                    </div>
                    <div className="text-xs text-emerald-800 font-medium">
                      {f.condition}
                    </div>
                    <div className="text-sm font-semibold font-mono text-stone-900">
                      {f.maxTemp}° <span className="text-stone-400 font-normal">/ {f.minTemp}°</span>
                    </div>
                    {f.precipitation > 0 && (
                      <div className="text-[10px] text-sky-700 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{f.precipitation} mm</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Climate context */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-500">
            <span>
              <strong>Regional climate profile:</strong> Hosur experiences a semi-arid, pleasant plateau climate characterized by cooler temperatures compared to lower plains of Tamil Nadu.
            </span>
            <span className="text-stone-400 shrink-0">Station: Hosur AWS Telemetry</span>
          </div>
        </div>
      </div>
    </section>
  );
}
