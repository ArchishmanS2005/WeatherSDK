import { BaseService } from './base';

export interface SolarParams {
    hourly?: string[];
    daily?: string[];
    timezone?: string;
    forecast_days?: number;
    past_days?: number;
}

export class SolarService extends BaseService {
    protected baseUrl = 'https://api.open-meteo.com/v1/forecast';

    async getForecast(lat: number, lon: number, params: SolarParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }
}
