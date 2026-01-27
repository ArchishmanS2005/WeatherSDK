import { WeatherConfig } from './types';
import { WeatherService } from './services/weather';
import { HistoricalService } from './services/historical';
import { GeocodingService } from './services/geocoding';
import { AirQualityService } from './services/air-quality';
import { ClimateService } from './services/climate';
import { FloodService } from './services/flood';
import { MarineService } from './services/marine';
import { ElevationService } from './services/elevation';
import { SolarService } from './services/solar';
import { EnsembleService } from './services/ensemble';
import { SeasonalService } from './services/seasonal';
import { HistoricalForecastService } from './services/historical-forecast';

export class WeatherSDK {
    public weather: WeatherService;
    public historical: HistoricalService;
    public geocoding: GeocodingService;
    public airQuality: AirQualityService;
    public climate: ClimateService;
    public flood: FloodService;
    public marine: MarineService;
    public elevation: ElevationService;
    public solar: SolarService;
    public ensemble: EnsembleService;
    public seasonal: SeasonalService;
    public historicalForecast: HistoricalForecastService;

    constructor(private config: WeatherConfig = {}) {
        this.weather = new WeatherService(config);
        this.historical = new HistoricalService(config);
        this.geocoding = new GeocodingService(config);
        this.airQuality = new AirQualityService(config);
        this.climate = new ClimateService(config);
        this.flood = new FloodService(config);
        this.marine = new MarineService(config);
        this.elevation = new ElevationService(config);
        this.solar = new SolarService(config);
        this.ensemble = new EnsembleService(config);
        this.seasonal = new SeasonalService(config);
        this.historicalForecast = new HistoricalForecastService(config);
    }
}
