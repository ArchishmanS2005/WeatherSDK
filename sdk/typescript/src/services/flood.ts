import { BaseService } from './base';

export interface FloodParams {
    daily?: string[];
    forecast_days?: number;
    past_days?: number;
    start_date?: string;
    end_date?: string;
    models?: string[];
}

export class FloodService extends BaseService {
    protected baseUrl = 'https://flood-api.open-meteo.com/v1/flood';

    async getForecast(lat: number, lon: number, params: FloodParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params
        });
    }
}
