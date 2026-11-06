import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const HOSUR_DEFAULT_LAT = 12.7409;
const HOSUR_DEFAULT_LON = 77.8253;

function getMarkerColor(category = '') {
  const c = category.toLowerCase();
  if (c.includes('hospital') || c.includes('health') || c.includes('phc')) return '#dc2626'; // red
  if (c.includes('bank') || c.includes('atm')) return '#2563eb'; // blue
  if (c.includes('gov') || c.includes('office')) return '#475569'; // slate
  if (c.includes('religious') || c.includes('temple')) return '#d97706'; // amber
  return '#059669'; // emerald
}

function createItemIcon(category) {
  const color = getMarkerColor(category);
  return L.divIcon({
    className: 'hosur-directory-pin',
    html: `
      <div style="position: relative; width: 28px; height: 36px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 24 24" width="28" height="36" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>
          <circle cx="12" cy="9" r="2.8" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32],
  });
}

export default function MapView({ items = [], selectedId, onSelect, height = '480px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [HOSUR_DEFAULT_LAT, HOSUR_DEFAULT_LON],
      zoom: 13,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markerGroup = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;
    markerGroupRef.current = markerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerGroupRef.current = null;
    };
  }, []);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;

    const group = markerGroupRef.current;
    group.clearLayers();

    const validItems = items.filter((item) => item.latitude && item.longitude);

    validItems.forEach((item) => {
      const marker = L.marker([item.latitude, item.longitude], {
        icon: createItemIcon(item.category),
      });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; max-width: 240px; padding: 2px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px; border: 1px solid #a7f3d0;">
            ${item.category || 'Listing'}
          </span>
          <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 4px 0; line-height: 1.25;">
            ${item.name}
          </h4>
          <p style="font-size: 12px; color: #57534e; margin: 0 0 6px 0; line-height: 1.35;">
            ${item.address || item.locality || ''}
          </p>
          ${item.phone ? `<p style="font-size: 11px; color: #065f46; font-weight: 600; margin: 0 0 6px 0;">📞 ${item.phone}</p>` : ''}
          <div style="margin-top: 6px; pt: 4px; border-top: 1px solid #e7e5e4;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}" target="_blank" rel="noopener noreferrer" style="color: #047857; font-weight: 600; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
              Directions on Maps &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onSelect) {
        marker.on('click', () => onSelect(item));
      }

      group.addLayer(marker);
    });

    if (validItems.length > 0) {
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), { maxZoom: 15 });
    } else {
      mapInstanceRef.current.setView([HOSUR_DEFAULT_LAT, HOSUR_DEFAULT_LON], 13);
    }
  }, [items, onSelect]);

  return (
    <div className="relative w-full rounded-2xl border border-stone-200 overflow-hidden shadow-xs bg-stone-100">
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full z-0"
      />
    </div>
  );
}

