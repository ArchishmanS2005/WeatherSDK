from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..utils.export import PandasExportMixin

class EnsembleHourly(BaseModel, PandasExportMixin):
    time: List[str]
    # Allow dynamic fields for members (temperature_2m_member01, etc.)
    # Pydantic allows extra fields by default if not forbid
    model_config = {"extra": "allow"}

class EnsembleResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    elevation: float
    hourly_units: Optional[Dict[str, str]] = None
    hourly: Optional[EnsembleHourly] = None
