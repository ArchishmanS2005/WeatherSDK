from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class SeasonalDaily(BaseModel, PandasExportMixin):
    time: List[str]
    # Allow dynamic member fields (temperature_2m_max_member01, etc.)
    model_config = {"extra": "allow"}

class SeasonalResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    elevation: float
    daily_units: Optional[Dict[str, str]] = None
    daily: Optional[SeasonalDaily] = None
