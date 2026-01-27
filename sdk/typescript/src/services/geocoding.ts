import { BaseService } from './base';

export interface GeocodingParams {
    name: string;
    count?: number;
    language?: string;
    format?: 'json' | 'protobuf';
}

export class GeocodingService extends BaseService {
    protected baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

    // Override validateCoordinates as geocoding doesn't use it for search

    async search(name: string, count: number = 10, language: string = 'en') {
        return this.request('', {
            name,
            count,
            language,
            format: 'json'
        });
    }
}
