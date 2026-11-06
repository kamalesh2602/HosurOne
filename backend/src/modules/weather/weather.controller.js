import weatherService from './weather.service.js';

/**
 * Controller to handle GET /api/weather
 */
export async function getCurrentWeather(req, res, next) {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const data = await weatherService.getCurrentWeather(forceRefresh);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle GET /api/weather/forecast
 */
export async function getWeatherForecast(req, res, next) {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const data = await weatherService.getWeatherForecast(forceRefresh);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export default { getCurrentWeather, getWeatherForecast };

