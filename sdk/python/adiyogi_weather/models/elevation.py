from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TerrainType(BaseModel):
    type: str
    description: str
    color: str

class ElevationData(BaseModel):
    latitude: float
    longitude: float
    elevation_meters: float
    elevation_feet: float
    terrain: TerrainType

class ElevationBatchData(BaseModel):
    locations: List[ElevationData]
