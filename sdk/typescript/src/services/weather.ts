import { BaseService } from './base';

export interface WeatherParams {
    hourly?: string[];
    daily?: string[];
    current?: string[];
    timezone?: string;
    forecast_days?: number;
    past_days?: number;
}

export class WeatherService extends BaseService {
    protected baseUrl = 'https://api.open-meteo.com/v1/forecast';

    async getForecast(lat: number, lon: number, params: WeatherParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }
}
