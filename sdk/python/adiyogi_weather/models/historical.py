from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class HistoricalDaily(BaseModel, PandasExportMixin):
    time: List[str]
    temperature_2m_max: Optional[List[float]] = None
    temperature_2m_min: Optional[List[float]] = None
    temperature_2m_mean: Optional[List[float]] = None
    precipitation_sum: Optional[List[float]] = None
    rain_sum: Optional[List[float]] = None
    snowfall_sum: Optional[List[float]] = None
    wind_speed_10m_max: Optional[List[float]] = None

class HistoricalResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    daily_units: Optional[Dict[str, str]] = None
    daily: Optional[HistoricalDaily] = None
