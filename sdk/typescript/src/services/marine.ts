import { BaseService } from './base';

export interface MarineParams {
    hourly?: string[];
    daily?: string[];
    current?: string[];
    timezone?: string;
    forecast_days?: number;
    past_days?: number;
}

export class MarineService extends BaseService {
    protected baseUrl = 'https://marine-api.open-meteo.com/v1/marine';

    async getForecast(lat: number, lon: number, params: MarineParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }
}
