from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class ClimateDaily(BaseModel, PandasExportMixin):
    time: List[str]
    temperature_2m_mean: Optional[List[Optional[float]]] = None
    temperature_2m_max: Optional[List[Optional[float]]] = None
    temperature_2m_min: Optional[List[Optional[float]]] = None
    precipitation_sum: Optional[List[Optional[float]]] = None
    wind_speed_10m_mean: Optional[List[Optional[float]]] = None
    shortwave_radiation_sum: Optional[List[Optional[float]]] = None

class ClimateProjection(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    daily_units: Dict[str, str]
    daily: ClimateDaily

class TemperatureChange(BaseModel):
    average: float
    maximum: float
    minimum: float
    projected_change: float
    trend: str

class PrecipitationChange(BaseModel):
    total: float
    average_daily: float

class ClimateChangeSummary(BaseModel):
    temperature: TemperatureChange
    precipitation: PrecipitationChange
