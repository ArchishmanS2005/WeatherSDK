from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class HistoricalForecastHourly(BaseModel, PandasExportMixin):
    time: List[str]
    temperature_2m: Optional[List[Optional[float]]] = None
    relative_humidity_2m: Optional[List[Optional[int]]] = None
    dew_point_2m: Optional[List[Optional[float]]] = None
    apparent_temperature: Optional[List[Optional[float]]] = None
    precipitation_probability: Optional[List[Optional[int]]] = None
    precipitation: Optional[List[Optional[float]]] = None
    weather_code: Optional[List[Optional[int]]] = None
    pressure_msl: Optional[List[Optional[float]]] = None
    surface_pressure: Optional[List[Optional[float]]] = None
    cloud_cover: Optional[List[Optional[int]]] = None
    wind_speed_10m: Optional[List[Optional[float]]] = None
    wind_direction_10m: Optional[List[Optional[int]]] = None
    soil_temperature_0cm: Optional[List[Optional[float]]] = None
    soil_moisture_0_to_1cm: Optional[List[Optional[float]]] = None
    model_config = {"extra": "allow"}

class HistoricalForecastResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    elevation: float
    hourly_units: Optional[Dict[str, str]] = None
    hourly: Optional[HistoricalForecastHourly] = None
    daily_units: Optional[Dict[str, str]] = None
    # Add Daily model if needed, focusing on hourly for now as per user discovery
    daily: Optional[Dict[str, Any]] = None 
