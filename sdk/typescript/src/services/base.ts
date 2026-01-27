import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { APIError, SDKError, ValidationError } from '../types';

export abstract class BaseService {
    protected abstract baseUrl: string;
    protected client: AxiosInstance;

    constructor(config?: { timeout?: number }) {
        this.client = axios.create({
            timeout: config?.timeout || 10000,
            headers: {
                'User-Agent': 'AdiyogiWeatherSDK/0.1.0'
            }
        });
    }

    protected async request<T>(path: string, params: Record<string, any> = {}): Promise<T> {
        try {
            const response = await this.client.get<T>(this.baseUrl + path, { params });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new APIError(
                        `Open-Meteo API Error: ${error.response.status} ${error.response.statusText}`,
                        error.response.status,
                        error.response.data
                    );
                } else if (error.request) {
                    throw new SDKError('Network Error: No response received from Open-Meteo API', error);
                }
            }
            throw new SDKError('Unexpected SDK Error', error);
        }
    }

    protected validateCoordinates(lat: number, lon: number): void {
        if (lat < -90 || lat > 90) {
            throw new ValidationError(`Invalid latitude: ${lat}. Must be between -90 and 90.`);
        }
        if (lon < -180 || lon > 180) {
            throw new ValidationError(`Invalid longitude: ${lon}. Must be between -180 and 180.`);
        }
    }
}
