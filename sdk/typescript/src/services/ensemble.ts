import { BaseService } from './base';

export interface EnsembleParams {
    hourly?: string[];
    forecast_days?: number;
    past_days?: number;
    start_date?: string;
    end_date?: string;
    models?: string[];
}

export class EnsembleService extends BaseService {
    protected baseUrl = 'https://ensemble-api.open-meteo.com/v1/ensemble';

    async getForecast(lat: number, lon: number, params: EnsembleParams = {}) {
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
