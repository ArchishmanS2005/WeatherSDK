// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://weathersdk.onrender.com';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LocationResult {
    id: number;
    name: string;
    country: string;
    country_code: string;
    latitude: number;
    longitude: number;
    timezone: string;
    population?: number;
    admin1?: string;
}

export interface CurrentWeather {
    time: string;
    temperature: number;
    apparent_temperature: number;
    weather_code: number;
    weather_description: string;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_direction: number;
    wind_gusts: number;
    cloud_cover: number;
    precipitation: number;
    visibility?: number;
    uv_index?: number;
}

export interface HourlyForecast {
    time: string[];
    temperature: number[];
    apparent_temperature: number[];
    weather_code: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed: number[];
    wind_direction: number[];
    humidity: number[];
    cloud_cover: number[];
}

export interface DailyForecast {
    time: string[];
    temperature_max: number[];
    temperature_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    wind_speed_max: number[];
}

export interface WeatherResponse {
    location: {
        latitude: number;
        longitude: number;
        timezone: string;
        elevation?: number;
    };
    current?: CurrentWeather;
    hourly?: HourlyForecast;
    daily?: DailyForecast;
    units: {
        temperature: string;
        wind_speed: string;
        precipitation: string;
        pressure: string;
    };
}

// Air Quality Types
export interface AQICategory {
    category: string;
    color: string;
    recommendation: string;
}

export interface AirQualityData {
    latitude: number;
    longitude: number;
    current?: {
        time: string;
        pm10: number;
        pm2_5: number;
        carbon_monoxide: number;
        nitrogen_dioxide: number;
        sulphur_dioxide: number;
        ozone: number;
        dust: number;
        uv_index: number;
        european_aqi: number;
        us_aqi: number;
    };
    hourly?: {
        time: string[];
        pm10: number[];
        pm2_5: number[];
        european_aqi: number[];
        us_aqi: number[];
    };
    european_aqi_category?: AQICategory;
    us_aqi_category?: AQICategory;
}

// Marine Weather Types
export interface WaveConditions {
    condition: string;
    description: string;
    color: string;
}

export interface MarineData {
    latitude: number;
    longitude: number;
    current?: {
        time: string;
        wave_height: number;
        wave_direction: number;
        wave_period: number;
        swell_wave_height: number;
        ocean_current_velocity: number;
        ocean_current_direction: number;
    };
    hourly?: {
        time: string[];
        wave_height: number[];
        wave_direction: number[];
        wave_period: number[];
    };
    daily?: {
        time: string[];
        wave_height_max: number[];
        wave_period_max: number[];
    };
    wave_conditions?: WaveConditions;
}

// Historical Weather Types
export interface HistoricalData {
    latitude: number;
    longitude: number;
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        temperature_2m_mean: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
    };
}

export interface MonthlyStats {
    [month: string]: {
        temperature_max: {
            min: number;
            max: number;
            mean: number;
            median: number;
        };
        temperature_min: {
            min: number;
            max: number;
            mean: number;
            median: number;
        };
        precipitation_total: number;
        precipitation_days: number;
    };
}

// Solar Radiation Types
export interface SolarPotential {
    rating: string;
    description: string;
    color: string;
    efficiency: string;
}

export interface SolarData {
    latitude: number;
    longitude: number;
    current?: {
        time: string;
        shortwave_radiation: number;
        direct_radiation: number;
        diffuse_radiation: number;
        direct_normal_irradiance: number;
    };
    hourly?: {
        time: string[];
        shortwave_radiation: number[];
        direct_radiation: number[];
    };
    daily?: {
        time: string[];
        sunrise: string[];
        sunset: string[];
        sunshine_duration: number[];
        shortwave_radiation_sum: number[];
    };
    solar_potential?: SolarPotential;
    best_solar_hours?: Array<{
        time: string;
        radiation: number;
        potential: SolarPotential;
    }>;
}

// Climate Projection Types
export interface ClimateSummary {
    temperature: {
        average: number;
        maximum: number;
        minimum: number;
        projected_change: number;
        trend: string;
    };
    precipitation: {
        total: number;
        average_daily: number;
    };
}

export interface ClimateData {
    latitude: number;
    longitude: number;
    daily: {
        time: string[];
        temperature_2m_mean: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        wind_speed_10m_mean?: number[];
    };
    summary?: ClimateSummary;
}

// Flood Types
export interface FloodRisk {
    level: string;
    description: string;
    color: string;
    max_discharge: number;
    avg_discharge: number;
    unit: string;
}

export interface FloodData {
    latitude: number;
    longitude: number;
    daily: {
        time: string[];
        river_discharge: number[];
        river_discharge_mean?: number[];
        river_discharge_max?: number[];
    };
    flood_risk?: FloodRisk;
    statistics?: {
        mean: number;
        max: number;
        min: number;
        median: number;
        unit: string;
    };
}

// Elevation Types
export interface TerrainType {
    type: string;
    description: string;
    color: string;
}

export interface ElevationData {
    elevation: number[];
    terrain_type?: TerrainType;
    elevation_meters?: number;
    elevation_feet?: number;
    // Batch specific
    terrain_types?: TerrainType[];
}


// ============================================================================
// WEATHER API FUNCTIONS
// ============================================================================

export async function searchLocation(query: string): Promise<LocationResult[]> {
    const response = await fetch(
        `${API_BASE_URL}/api/geocoding/search?query=${encodeURIComponent(query)}&count=5`
    );

    if (!response.ok) {
        throw new Error('Failed to search location');
    }

    const data = await response.json();
    return data.results || [];
}

export async function getReverseGeocode(lat: number, lon: number) {
    const url = `${API_BASE_URL}/api/geocoding/reverse?lat=${lat}&lon=${lon}`;
    console.log("Fetching reverse geocode:", url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to reverse geocode: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export async function getCurrentWeather(
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherResponse> {
    const response = await fetch(
        `${API_BASE_URL}/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch current weather');
    }

    return response.json();
}

export async function getForecast(
    lat: number,
    lon: number,
    days: number = 7,
    units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherResponse> {
    const response = await fetch(
        `${API_BASE_URL}/api/weather/forecast?lat=${lat}&lon=${lon}&days=${days}&units=${units}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch forecast');
    }

    return response.json();
}

// ============================================================================
// AIR QUALITY API FUNCTIONS
// ============================================================================

export async function getCurrentAirQuality(
    lat: number,
    lon: number
): Promise<AirQualityData> {
    const response = await fetch(
        `${API_BASE_URL}/api/air-quality/current?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
    }

    return response.json();
}

export async function getAirQualityForecast(
    lat: number,
    lon: number,
    days: number = 5
): Promise<AirQualityData> {
    const response = await fetch(
        `${API_BASE_URL}/api/air-quality/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch air quality forecast');
    }

    return response.json();
}

// ============================================================================
// MARINE WEATHER API FUNCTIONS
// ============================================================================

export async function getCurrentMarineConditions(
    lat: number,
    lon: number
): Promise<MarineData> {
    const response = await fetch(
        `${API_BASE_URL}/api/marine/current?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch marine conditions');
    }

    return response.json();
}

export async function getMarineForecast(
    lat: number,
    lon: number,
    days: number = 7
): Promise<MarineData> {
    const response = await fetch(
        `${API_BASE_URL}/api/marine/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch marine forecast');
    }

    return response.json();
}

// ============================================================================
// HISTORICAL WEATHER API FUNCTIONS
// ============================================================================

export async function getHistoricalWeather(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
): Promise<HistoricalData> {
    const response = await fetch(
        `${API_BASE_URL}/api/historical/weather?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch historical weather');
    }

    return response.json();
}

export async function getHistoricalStats(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
): Promise<{ monthly_statistics: MonthlyStats }> {
    const response = await fetch(
        `${API_BASE_URL}/api/historical/stats?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch historical statistics');
    }

    return response.json();
}

// ============================================================================
// SOLAR RADIATION API FUNCTIONS
// ============================================================================

export async function getCurrentSolarData(
    lat: number,
    lon: number
): Promise<SolarData> {
    const response = await fetch(
        `${API_BASE_URL}/api/solar/current?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch solar data');
    }

    return response.json();
}

export async function getSolarForecast(
    lat: number,
    lon: number,
    days: number = 7
): Promise<SolarData> {
    const response = await fetch(
        `${API_BASE_URL}/api/solar/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch solar forecast');
    }

    return response.json();
}

// ============================================================================
// CLIMATE API FUNCTIONS
// ============================================================================

export async function getClimateProjections(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
): Promise<ClimateData> {
    const response = await fetch(
        `${API_BASE_URL}/api/climate/projections?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch climate projections');
    }

    return response.json();
}

// ============================================================================
// FLOOD API FUNCTIONS
// ============================================================================

export async function getFloodForecast(
    lat: number,
    lon: number,
    days: number = 7
): Promise<FloodData> {
    const response = await fetch(
        `${API_BASE_URL}/api/flood/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch flood forecast');
    }

    return response.json();
}

// ============================================================================
// ELEVATION API FUNCTIONS
// ============================================================================

export async function getElevation(
    lat: number,
    lon: number
): Promise<ElevationData> {
    const response = await fetch(
        `${API_BASE_URL}/api/elevation?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch elevation data');
    }

    return response.json();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getWeatherIcon(code: number): string {
    const iconMap: { [key: number]: string } = {
        0: '☀️',   // Clear sky
        1: '🌤️',   // Mainly clear
        2: '⛅',   // Partly cloudy
        3: '☁️',   // Overcast
        45: '🌫️',  // Fog
        48: '🌫️',  // Depositing rime fog
        51: '🌦️',  // Drizzle: Light
        53: '🌦️',  // Drizzle: Moderate
        55: '🌦️',  // Drizzle: Dense
        61: '🌧️',  // Rain: Slight
        63: '🌧️',  // Rain: Moderate
        65: '🌧️',  // Rain: Heavy
        71: '🌨️',  // Snow: Slight
        73: '🌨️',  // Snow: Moderate
        75: '🌨️',  // Snow: Heavy
        80: '🌦️',  // Rain showers: Slight
        81: '🌧️',  // Rain showers: Moderate
        82: '⛈️',  // Thunderstorm
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with hail
        99: '⛈️',  // Thunderstorm with heavy hail
    };

    return iconMap[code] || '🌤️';
}

export function getAQIColor(aqi: number, type: 'european' | 'us' = 'european'): string {
    if (type === 'european') {
        if (aqi <= 20) return '#50f0e6';
        if (aqi <= 40) return '#50ccaa';
        if (aqi <= 60) return '#f0e641';
        if (aqi <= 80) return '#ff5050';
        if (aqi <= 100) return '#960032';
        return '#7d2181';
    } else {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    }
}
