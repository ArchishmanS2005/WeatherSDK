from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class SolarHourly(BaseModel, PandasExportMixin):
    time: List[str]
    shortwave_radiation: Optional[List[float]] = None
    direct_radiation: Optional[List[float]] = None
    diffuse_radiation: Optional[List[float]] = None
    direct_normal_irradiance: Optional[List[float]] = None
    global_tilted_irradiance: Optional[List[float]] = None
    terrestrial_radiation: Optional[List[float]] = None

class SolarDaily(BaseModel, PandasExportMixin):
    time: List[str]
    shortwave_radiation_sum: Optional[List[float]] = None
    terrestrial_radiation_sum: Optional[List[float]] = None

class SolarResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    hourly_units: Optional[Dict[str, str]] = None
    hourly: Optional[SolarHourly] = None
    daily_units: Optional[Dict[str, str]] = None
    daily: Optional[SolarDaily] = None
