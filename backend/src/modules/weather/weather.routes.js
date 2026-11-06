import { Router } from 'express';
import { getCurrentWeather, getWeatherForecast } from './weather.controller.js';

const router = Router();

// GET /api/weather - Current conditions & summary
router.get('/', getCurrentWeather);

// GET /api/weather/forecast - Detailed hourly & 7-day forecast
router.get('/forecast', getWeatherForecast);

export default router;
