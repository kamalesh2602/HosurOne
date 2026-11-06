import { getHosurWeather } from '../services/weather.service.js';

/**
 * Controller to handle GET /api/weather
 */
export async function getWeather(req, res, next) {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const weatherData = await getHosurWeather(forceRefresh);

    return res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
}

export default { getWeather };

