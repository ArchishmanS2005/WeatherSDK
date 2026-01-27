from pydantic import BaseModel
from typing import List, Optional

class Location(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    feature_code: Optional[str] = None
    country_code: Optional[str] = None
    admin1_id: Optional[int] = None
    admin2_id: Optional[int] = None
    timezone: str
    population: Optional[int] = None
    country_id: Optional[int] = None
    country: Optional[str] = None
    admin1: Optional[str] = None
    admin2: Optional[str] = None

class GeocodingResponse(BaseModel):
    results: List[Location] = []
    generationtime_ms: float
