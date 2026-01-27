import { BaseService } from './base';

export class ElevationService extends BaseService {
    protected baseUrl = 'https://api.open-meteo.com/v1/elevation';

    async getElevation(lat: number, lon: number) {
        this.validateCoordinates(lat, lon);
        return this.request('', {
            latitude: lat,
            longitude: lon
        });
    }
}
