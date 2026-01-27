export interface WeatherConfig {
    apiKey?: string;
    retryCount?: number;
    timeout?: number;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export class SDKError extends Error {
    constructor(message: string, public cause?: any) {
        super(message);
        this.name = 'SDKError';
    }
}

export class APIError extends SDKError {
    constructor(message: string, public statusCode?: number, cause?: any) {
        super(message, cause);
        this.name = 'APIError';
    }
}

export class ValidationError extends SDKError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
