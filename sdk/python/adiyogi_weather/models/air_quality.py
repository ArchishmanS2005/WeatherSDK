from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class AirQualityCurrent(BaseModel):
    time: str
    interval: int
    pm10: Optional[float] = None
    pm2_5: Optional[float] = None
    carbon_monoxide: Optional[float] = None
    nitrogen_dioxide: Optional[float] = None
    sulphur_dioxide: Optional[float] = None
    ozone: Optional[float] = None
    aerosol_optical_depth: Optional[float] = None
    dust: Optional[float] = None
    uv_index: Optional[float] = None
    uv_index_clear_sky: Optional[float] = None
    ammonia: Optional[float] = None
    alder_pollen: Optional[float] = None
    birch_pollen: Optional[float] = None
    grass_pollen: Optional[float] = None
    mugwort_pollen: Optional[float] = None
    olive_pollen: Optional[float] = None
    ragweed_pollen: Optional[float] = None
    european_aqi: Optional[int] = None
    us_aqi: Optional[int] = None

class AirQualityHourly(BaseModel, PandasExportMixin):
    time: List[str]
    pm10: Optional[List[float]] = None
    pm2_5: Optional[List[float]] = None
    carbon_monoxide: Optional[List[float]] = None
    nitrogen_dioxide: Optional[List[float]] = None
    sulphur_dioxide: Optional[List[float]] = None
    ozone: Optional[List[float]] = None
    european_aqi: Optional[List[int]] = None
    us_aqi: Optional[List[int]] = None

class AirQualityResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    current_units: Optional[Dict[str, str]] = None
    current: Optional[AirQualityCurrent] = None
    hourly_units: Optional[Dict[str, str]] = None
    hourly: Optional[AirQualityHourly] = None
