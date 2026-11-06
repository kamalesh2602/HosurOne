import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Sunrise,
  Sunset,
  CalendarDays,
  Clock,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { fetchHosurForecast } from '../services/weatherApi';

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadForecast = useCallback(async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    try {
      const result = await fetchHosurForecast({
        refresh: isManual,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setData(result);
    } catch (err) {
      clearTimeout(timeout);
      setError(err.message || 'Unable to connect to Hosur weather service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(false);
  }, [loadForecast]);

  const formatTimeOnly = (iso) => {
    if (!iso) return '--:--';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  const formatHourOnly = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });
    } catch {
      return iso;
    }
  };

  const formatDayFull = (dateStr, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const current = data?.current;
  const location = data?.location;
  const hourly = data?.hourly || [];
  const daily = data?.daily || [];

  return (
    <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <div className="flex items-center gap-2">
            {data?.updatedAt && (
              <span className="text-xs text-stone-500 hidden sm:inline">
                Updated: {formatTimeOnly(data.updatedAt)}
                {data.cached && <span className="ml-1 text-stone-400 font-mono">(cached)</span>}
              </span>
            )}
            <button
              type="button"
              onClick={() => loadForecast(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 transition-colors border border-stone-200 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading || refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <SectionHeading
          badge="Hosur Regional Weather"
          title="Hosur Live Weather & 7-Day Forecast"
          subtitle="Real-time atmospheric telemetry, hourly forecast, and weekly weather outlook for the Hosur plateau region."
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">Live Weather Telemetry Unavailable</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                {error}. HosurOne does not fabricate weather estimates. Please retry using the refresh button above.
              </p>
            </div>
          </div>
        )}

        {/* 1. Main Current Weather Overview Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Hosur Regional Weather Station
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Feed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Krishnagiri District, Tamil Nadu • 12.7409° N, 77.8253° E • Elevation ~862m (2,828 ft)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono tracking-tight">
                  {loading ? '--' : `${current?.temperature}°C`}
                </div>
                <div className="text-xs sm:text-sm text-stone-500 font-medium">
                  {loading ? 'Connecting...' : current?.condition}
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/60 shrink-0">
                <CloudSun className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-6">
            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Feels Like</span>
                <Thermometer className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--' : `${current?.feelsLike}°C`}
              </div>
              <div className="text-[10px] text-stone-400">Heat index</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Humidity</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--' : `${current?.humidity}%`}
              </div>
              <div className="text-[10px] text-stone-400">Moisture</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Wind Speed</span>
                <Wind className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--' : `${current?.windSpeed} km/h`}
              </div>
              <div className="text-[10px] text-stone-400">Surface velocity</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Rainfall</span>
                <CloudRain className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--' : `${current?.precipitation} mm`}
              </div>
              <div className="text-[10px] text-stone-400">Current rain</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Sunrise</span>
                <Sunrise className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--:--' : formatTimeOnly(data?.sunrise)}
              </div>
              <div className="text-[10px] text-stone-400">Morning dawn</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Sunset</span>
                <Sunset className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-lg font-bold font-mono text-stone-900">
                {loading ? '--:--' : formatTimeOnly(data?.sunset)}
              </div>
              <div className="text-[10px] text-stone-400">Evening dusk</div>
            </div>
          </div>
        </div>

        {/* 2. Hourly Forecast Strip (24 hours) */}
        {hourly.length > 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-800" />
              <span>Next 24-Hour Forecast</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
              {hourly.map((h, i) => (
                <div
                  key={h.time || i}
                  className="flex-shrink-0 w-24 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center space-y-1.5"
                >
                  <div className="text-[11px] font-semibold text-stone-500">
                    {formatHourOnly(h.time)}
                  </div>
                  <div className="text-base font-bold font-mono text-stone-900">
                    {h.temperature}°
                  </div>
                  <div className="text-[10px] text-emerald-800 font-medium truncate" title={h.condition}>
                    {h.condition}
                  </div>
                  {h.precipitationProbability > 0 && (
                    <div className="text-[10px] text-sky-700 flex items-center justify-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{h.precipitationProbability}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Seven-Day Daily Weather Forecast */}
        {daily.length > 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider">
              <CalendarDays className="w-4 h-4 text-emerald-800" />
              <span>7-Day Weather Outlook</span>
            </div>

            <div className="divide-y divide-stone-100">
              {daily.map((d, index) => (
                <div
                  key={d.date}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 px-2 rounded-xl transition-colors"
                >
                  <div className="w-44">
                    <div className="text-sm font-bold text-stone-900">
                      {formatDayFull(d.date, index)}
                    </div>
                    <div className="text-xs text-stone-500">{d.date}</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 sm:w-48">
                    <span>{d.condition}</span>
                  </div>

                  {d.precipitationProbability > 0 ? (
                    <div className="text-xs text-sky-700 font-medium flex items-center gap-1 sm:w-32">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{d.precipitationProbability}% precip ({d.precipitation} mm)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 sm:w-32">No rain expected</div>
                  )}

                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="font-bold text-stone-900">{d.maxTemp}°C</span>
                    <span className="text-stone-400">/</span>
                    <span className="text-stone-500">{d.minTemp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Civic climate context card */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Station telemetry note:</strong> Hosur sits at ~862 meters elevation on the Mysore Plateau ridge, contributing to significantly cooler, pleasant temperatures compared to lower districts.
            </span>
          </div>
          <span className="text-stone-400 shrink-0">Provider: Open-Meteo AWS</span>
        </div>
      </div>
    </main>
  );
}
