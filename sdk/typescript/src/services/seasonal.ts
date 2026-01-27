import { BaseService } from './base';

export interface SeasonalParams {
    daily?: string[];
    start_date?: string;
    end_date?: string;
}

export class SeasonalService extends BaseService {
    protected baseUrl = 'https://seasonal-api.open-meteo.com/v1/seasonal';

    async getForecast(lat: number, lon: number, params: SeasonalParams = {}) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon,
            daily: params.daily || ["temperature_2m_max", "temperature_2m_min"],
            start_date: params.start_date,
            end_date: params.end_date,
            timezone: 'auto'
        });
    }
}
