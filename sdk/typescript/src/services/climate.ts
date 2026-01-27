import { BaseService } from './base';

export interface ClimateParams {
    start_date?: string;
    end_date?: string;
    models?: string[];
    daily?: string[];
    timezone?: string;
}

export class ClimateService extends BaseService {
    protected baseUrl = 'https://climate-api.open-meteo.com/v1/climate';

    async getProjections(lat: number, lon: number, params: ClimateParams = {}) {
        this.validateCoordinates(lat, lon);
        // Add default model if not provided, similar to Python SDK
        const defaultParams: any = { ...params };
        if (!defaultParams.models) {
            defaultParams.models = 'EC_Earth3P_HR';
        }

        // Process models array to string if array given
        if (Array.isArray(defaultParams.models)) {
            defaultParams.models = defaultParams.models.join(',');
        }

        return this.request('', {
            latitude: lat,
            longitude: lon,
            ...defaultParams,
            timezone: params.timezone || 'auto'
        });
    }
}
