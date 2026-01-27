from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class MarineCurrent(BaseModel):
    time: str
    interval: int
    wave_height: Optional[float] = None
    wave_direction: Optional[float] = None
    wave_period: Optional[float] = None
    wind_wave_height: Optional[float] = None
    wind_wave_direction: Optional[float] = None
    wind_wave_period: Optional[float] = None
    swell_wave_height: Optional[float] = None
    swell_wave_direction: Optional[float] = None
    swell_wave_period: Optional[float] = None

class MarineHourly(BaseModel, PandasExportMixin):
    time: List[str]
    wave_height: Optional[List[float]] = None
    wave_direction: Optional[List[float]] = None
    wave_period: Optional[List[float]] = None

class MarineDaily(BaseModel, PandasExportMixin):
    time: List[str]
    wave_height_max: Optional[List[float]] = None
    wave_direction_dominant: Optional[List[float]] = None
    wave_period_max: Optional[List[float]] = None

class MarineResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    current_units: Optional[Dict[str, str]] = None
    current: Optional[MarineCurrent] = None
    hourly_units: Optional[Dict[str, str]] = None
    hourly: Optional[MarineHourly] = None
    daily_units: Optional[Dict[str, str]] = None
    daily: Optional[MarineDaily] = None
