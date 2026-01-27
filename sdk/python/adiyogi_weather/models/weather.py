from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from ..utils.export import PandasExportMixin

class CurrentWeather(BaseModel):
    time: str
    interval: int
    temperature_2m: float
    relative_humidity_2m: int
    apparent_temperature: float
    is_day: int
    precipitation: float
    rain: float
    showers: float
    snowfall: float
    weather_code: int
    cloud_cover: int
    pressure_msl: float
    surface_pressure: float
    wind_speed_10m: float
    wind_direction_10m: int
    wind_gusts_10m: float

class HourlyUnits(BaseModel):
    time: str
    temperature_2m: str
    relative_humidity_2m: str
    
class HourlyForecast(BaseModel, PandasExportMixin):
    time: List[str]
    temperature_2m: List[float]
    relative_humidity_2m: List[int]
    dew_point_2m: List[float]
    apparent_temperature: List[float]
    precipitation_probability: List[int]
    precipitation: List[float]
    
class DailyUnits(BaseModel):
    time: str
    temperature_2m_max: str
    temperature_2m_min: str

class DailyForecast(BaseModel, PandasExportMixin):
    time: List[str]
    weather_code: List[int]
    temperature_2m_max: List[float]
    temperature_2m_min: List[float]
    apparent_temperature_max: List[float]
    apparent_temperature_min: List[float]
    sunrise: List[str]
    sunset: List[str]
    uv_index_max: List[float]
    precipitation_sum: List[float]
    
class WeatherResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    elevation: float
    current_units: Optional[Dict[str, str]] = None
    current: Optional[CurrentWeather] = None
    hourly_units: Optional[HourlyUnits] = None
    hourly: Optional[HourlyForecast] = None
    daily_units: Optional[DailyUnits] = None
    daily: Optional[DailyForecast] = None
