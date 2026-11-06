/**
 * Abstract Weather Provider Interface
 * Standardizes the contract for external weather providers
 */
export class WeatherProvider {
  /**
   * @param {string} name - Provider identifier
   */
  constructor(name) {
    if (this.constructor === WeatherProvider) {
      throw new Error('Abstract class WeatherProvider cannot be instantiated directly.');
    }
    this.name = name;
  }

  /**
   * Fetch current weather conditions
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object>}
   */
  async getCurrent(latitude, longitude) {
    throw new Error('Method getCurrent() must be implemented.');
  }

  /**
   * Fetch detailed weather forecast (hourly & daily)
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object>}
   */
  async getForecast(latitude, longitude) {
    throw new Error('Method getForecast() must be implemented.');
  }
}

export default WeatherProvider;

