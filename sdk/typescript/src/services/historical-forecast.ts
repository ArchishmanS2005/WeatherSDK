import { BaseService } from './base';

export interface HistoricalForecastParams {
    hourly?: string[];
    start_date: string;
    end_date: string;
    models?: string[];
}

export class HistoricalForecastService extends BaseService {
    protected baseUrl = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

    async getForecast(lat: number, lon: number, params: HistoricalForecastParams) {
        this.validateCoordinates(lat, lon);
        const apiParams: any = { ...params };
        if (Array.isArray(apiParams.models)) {
            apiParams.models = apiParams.models.join(',');
        }
        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...apiParams,
            timezone: 'auto'
        });
    }
}
