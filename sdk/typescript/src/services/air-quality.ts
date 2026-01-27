import { BaseService } from './base';

export interface AirQualityParams {
    hourly?: string[];
    current?: string[];
    timezone?: string;
    forecast_days?: number;
    past_days?: number;
    start_date?: string;
    end_date?: string;
}

export class AirQualityService extends BaseService {
    protected baseUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';

    async getForecast(lat: number, lon: number, params: AirQualityParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }

    async getHistorical(lat: number, lon: number, startDate: string, endDate: string, params: Omit<AirQualityParams, 'start_date' | 'end_date'> = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            start_date: startDate,
            end_date: endDate,
            ...params,
            timezone: params.timezone || 'auto'
        });
    }
}
