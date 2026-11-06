/**
 * Open-Meteo WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
const WMO_CODE_MAP = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  56: 'Light Freezing Drizzle',
  57: 'Dense Freezing Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  66: 'Light Freezing Rain',
  67: 'Heavy Freezing Rain',
  71: 'Slight Snow Fall',
  73: 'Moderate Snow Fall',
  75: 'Heavy Snow Fall',
  77: 'Snow Grains',
  80: 'Slight Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail',
};

/**
 * Translates numeric WMO weather code to readable string
 * @param {number} code
 * @returns {string}
 */
export function translateWeatherCode(code) {
  if (typeof code !== 'number') return 'Unknown';
  return WMO_CODE_MAP[code] || 'Fair Weather';
}

export default { translateWeatherCode, WMO_CODE_MAP };

