import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

const HOSUR_DEFAULT_LAT = 12.7409;
const HOSUR_DEFAULT_LON = 77.8253;

// Clean custom pin using HTML DivIcon to guarantee reliable rendering in Vite
function createCustomPin() {
  return L.divIcon({
    className: 'hosur-map-pin',
    html: `
      <div style="position: relative; width: 34px; height: 42px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 24 24" width="34" height="42" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#047857" stroke="#ffffff" stroke-width="1.8"/>
          <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
  });
}

const REGIONAL_SHORTCUTS = [
  { name: 'Hosur City', lat: 12.7368, lon: 77.8334 },
  { name: 'SIPCOT Industrial', lat: 12.7512, lon: 77.8142 },
  { name: 'Bagalur', lat: 12.8250, lon: 77.8820 },
  { name: 'Kelamangalam', lat: 12.6042, lon: 77.8596 },
  { name: 'Denkanikottai', lat: 12.5284, lon: 77.7850 },
];

export default function LocationPicker({ value, onChange }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const currentLat = value?.latitude || HOSUR_DEFAULT_LAT;
  const currentLon = value?.longitude || HOSUR_DEFAULT_LON;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (mapInstanceRef.current) return;

    const initialLat = value?.latitude || HOSUR_DEFAULT_LAT;
    const initialLon = value?.longitude || HOSUR_DEFAULT_LON;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([initialLat, initialLon], {
      icon: createCustomPin(),
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange?.({
        latitude: parseFloat(pos.lat.toFixed(6)),
        longitude: parseFloat(pos.lng.toFixed(6)),
      });
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange?.({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync external coordinate value changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && value?.latitude && value?.longitude) {
      const cur = markerRef.current.getLatLng();
      if (Math.abs(cur.lat - value.latitude) > 0.0001 || Math.abs(cur.lng - value.longitude) > 0.0001) {
        markerRef.current.setLatLng([value.latitude, value.longitude]);
        mapInstanceRef.current.panTo([value.latitude, value.longitude]);
      }
    }
  }, [value?.latitude, value?.longitude]);

  const handleShortcutClick = (lat, lon) => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lon], 15);
      markerRef.current.setLatLng([lat, lon]);
      onChange?.({
        latitude: lat,
        longitude: lon,
      });
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lon = parseFloat(pos.coords.longitude.toFixed(6));
          mapInstanceRef.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
          onChange?.({ latitude: lat, longitude: lon });
        },
        (err) => {
          console.warn('Geolocation unavailable:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <span className="font-medium text-stone-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          Click on map or drag the pin to set precise location:
        </span>
        <button
          type="button"
          onClick={handleLocateMe}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
        >
          <Navigation className="w-3 h-3" />
          Use My GPS
        </button>
      </div>

      {/* Regional centering shortcut pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-stone-500">
        <span className="shrink-0 flex items-center gap-1 font-medium text-stone-400">
          <Compass className="w-3 h-3" />
          Jump to:
        </span>
        {REGIONAL_SHORTCUTS.map((sc) => (
          <button
            key={sc.name}
            type="button"
            onClick={() => handleShortcutClick(sc.lat, sc.lon)}
            className="shrink-0 px-2 py-0.5 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 border border-stone-200 transition-colors text-[11px]"
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-64 sm:h-72 rounded-xl border border-stone-300 shadow-inner z-0 overflow-hidden"
      />

      {/* Coordinate display readout */}
      <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs">
        <span className="text-stone-500">Selected Coordinates:</span>
        <div className="font-mono font-semibold text-emerald-900">
          {currentLat.toFixed(6)}° N, {currentLon.toFixed(6)}° E
        </div>
      </div>
    </div>
  );
}
