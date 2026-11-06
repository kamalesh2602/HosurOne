import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { fetchHosurWeather } from '../../services/weatherApi';

/**
 * Top-Priority Compact Weather Summary Widget
 * Positioned immediately beneath the Hero section so users don't have to scroll.
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHosurWeather({ refresh });
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Weather telemetry offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(false);
  }, []);

  const current = weather?.current;

  return (
    <section className="bg-white border-b border-stone-200/90 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Location & Primary Condition */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-200 shrink-0 border border-white/10">
                <CloudSun className="w-6 h-6 text-amber-300" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Hosur, Tamil Nadu
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-200/80 font-medium">Live Telemetry</span>
                </div>

                <div className="flex items-baseline gap-2 mt-0.5">
                  {loading ? (
                    <div className="h-7 w-24 bg-white/20 animate-pulse rounded" />
                  ) : error ? (
                    <span className="text-sm text-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Telemetry offline
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                        {current?.temperature}°C
                      </span>
                      <span className="text-sm sm:text-base font-medium text-emerald-100">
                        {current?.condition}
                      </span>
                      <span className="text-xs text-emerald-300/80 hidden sm:inline">
                        (Feels like {current?.feelsLike}°C)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            {!error && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 text-xs border-t border-white/10 lg:border-t-0 pt-3 lg:pt-0">
                <div className="flex items-center gap-1.5 text-emerald-100">
                  <Droplets className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase">Humidity</div>
                    <div className="font-semibold font-mono">{loading ? '--' : `${current?.humidity}%`}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-100">
                  <Wind className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase">Wind</div>
                    <div className="font-semibold font-mono">{loading ? '--' : `${current?.windSpeed} km/h`}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-100">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase">Rain</div>
                    <div className="font-semibold font-mono">{loading ? '--' : `${current?.precipitation} mm`}</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-emerald-100">
                  <Thermometer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase">Elevation</div>
                    <div className="font-semibold font-mono">~862 m</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA to Full Weather Page */}
            <div className="flex items-center justify-between lg:justify-end gap-2 pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => loadWeather(true)}
                disabled={loading}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Refresh weather data"
                aria-label="Refresh weather data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <Link
                to="/weather"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-900 font-semibold text-xs hover:bg-emerald-50 transition-colors shadow-2xs group"
              >
                <span>Full Weather & 7-Day Forecast</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
