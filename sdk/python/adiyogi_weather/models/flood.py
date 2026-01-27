from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class FloodDaily(BaseModel, PandasExportMixin):
    time: List[str]
    river_discharge: Optional[List[float]] = None
    river_discharge_mean: Optional[List[float]] = None
    river_discharge_median: Optional[List[float]] = None
    river_discharge_max: Optional[List[float]] = None
    river_discharge_min: Optional[List[float]] = None
    river_discharge_p25: Optional[List[float]] = None
    river_discharge_p75: Optional[List[float]] = None

class FloodRisk(BaseModel):
    level: str
    description: str
    color: str
    max_discharge: float
    avg_discharge: float
    unit: str

class FloodForecast(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    daily_units: Dict[str, str]
    daily: FloodDaily
    flood_risk: Optional[FloodRisk] = None
