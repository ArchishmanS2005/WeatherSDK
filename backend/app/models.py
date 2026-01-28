from pydantic import BaseModel, Field
from typing import List, Optional
from enum import IntEnum
from datetime import datetime


class WeatherCode(IntEnum):
    """WMO Weather interpretation codes"""
    CLEAR_SKY = 0
    MAINLY_CLEAR = 1
    PARTLY_CLOUDY = 2
    OVERCAST = 3
    FOG = 45
    DEPOSITING_RIME_FOG = 48
    DRIZZLE_LIGHT = 51
    DRIZZLE_MODERATE = 53
    DRIZZLE_DENSE = 55
    FREEZING_DRIZZLE_LIGHT = 56
    FREEZING_DRIZZLE_DENSE = 57
    RAIN_SLIGHT = 61
    RAIN_MODERATE = 63
    RAIN_HEAVY = 65
    FREEZING_RAIN_LIGHT = 66
    FREEZING_RAIN_HEAVY = 67
    SNOW_SLIGHT = 71
    SNOW_MODERATE = 73
    SNOW_HEAVY = 75
    SNOW_GRAINS = 77
    RAIN_SHOWERS_SLIGHT = 80
    RAIN_SHOWERS_MODERATE = 81
    RAIN_SHOWERS_VIOLENT = 82
    SNOW_SHOWERS_SLIGHT = 85
    SNOW_SHOWERS_HEAVY = 86
    THUNDERSTORM = 95
    THUNDERSTORM_SLIGHT_HAIL = 96
    THUNDERSTORM_HEAVY_HAIL = 99


# Geocoding Models
class ReverseGeocodeResponse(BaseModel):
    name: str
    city: Optional[str] = None
    country: str


class LocationResult(BaseModel):
    """Single location search result"""
    id: int
    name: str
    country: str
    country_code: str
    latitude: float
    longitude: float
    timezone: str
    population: Optional[int] = None
    admin1: Optional[str] = None  # State/Province


class LocationSearchResponse(BaseModel):
    """Response from location search"""
    results: List[LocationResult] = []


# Weather Models
class LocationInfo(BaseModel):
    """Location information in weather responses"""
    latitude: float
    longitude: float
    timezone: str
    elevation: Optional[float] = None


class CurrentWeather(BaseModel):
    """Current weather conditions"""
    time: str
    temperature: float
    apparent_temperature: float
    weather_code: int
    weather_description: str
    humidity: int
    pressure: float
    wind_speed: float
    wind_direction: int
    wind_gusts: float
    cloud_cover: int
    precipitation: float
    visibility: Optional[float] = None
    uv_index: Optional[float] = None


class WeatherUnits(BaseModel):
    """Units for weather measurements"""
    temperature: str = "°C"
    wind_speed: str = "km/h"
    precipitation: str = "mm"
    pressure: str = "hPa"
    visibility: str = "m"


class CurrentWeatherResponse(BaseModel):
    """Complete current weather response"""
    location: LocationInfo
    current: CurrentWeather
    units: WeatherUnits


class HourlyForecast(BaseModel):
    """Hourly forecast data"""
    time: List[str]
    temperature: List[float]
    apparent_temperature: List[float]
    weather_code: List[int]
    precipitation_probability: List[int]
    precipitation: List[float]
    wind_speed: List[float]
    wind_direction: List[int]
    humidity: List[int]
    cloud_cover: List[int]


class DailyForecast(BaseModel):
    """Daily forecast data"""
    time: List[str]
    temperature_max: List[float]
    temperature_min: List[float]
    weather_code: List[int]
    precipitation_sum: List[float]
    precipitation_probability_max: List[int]
    sunrise: List[str]
    sunset: List[str]
    uv_index_max: List[float]
    wind_speed_max: List[float]


class ForecastResponse(BaseModel):
    """Complete forecast response"""
    location: LocationInfo
    current: Optional[CurrentWeather] = None
    hourly: HourlyForecast
    daily: DailyForecast
    units: WeatherUnits


class ErrorResponse(BaseModel):
    """Error response model"""
    error: bool = True
    message: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
