import { BaseService } from './base';

export interface HistoricalParams {
    start_date: string;
    end_date: string;
    hourly?: string[];
    daily?: string[];
    timezone?: string;
}

export class HistoricalService extends BaseService {
    protected baseUrl = 'https://archive-api.open-meteo.com/v1/archive';

    async getWeather(lat: number, lon: number, params: HistoricalParams) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }
}
