from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.elevation import ElevationData, TerrainType, ElevationBatchData
from ..utils.validators import validate_coordinates

class ElevationService(BaseService):
    """Service for accessing the Open-Meteo Elevation API"""
    
    BASE_URL = "https://api.open-meteo.com/v1/elevation"
    
    def get_point(self, lat: float, lon: float) -> ElevationData:
        """Get elevation for a single point"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        
        elev = data.get("elevation", [0])[0]
        terrain = self._classify_terrain(elev)
        
        return ElevationData(
            latitude=lat,
            longitude=lon,
            elevation_meters=elev,
            elevation_feet=round(elev * 3.28084, 2),
            terrain=terrain
        )
        
    async def get_point_async(self, lat: float, lon: float) -> ElevationData:
        """Async version of get_point"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        
        elev = data.get("elevation", [0])[0]
        terrain = self._classify_terrain(elev)
        
        return ElevationData(
            latitude=lat,
            longitude=lon,
            elevation_meters=elev,
            elevation_feet=round(elev * 3.28084, 2),
            terrain=terrain
        )

    def _classify_terrain(self, elev: float) -> TerrainType:
        """Classify terrain type"""
        if elev < 0:
            return TerrainType(type="Below Sea Level", description="Depression/Underwater", color="#4ecdc4")
        elif elev < 200:
            return TerrainType(type="Lowland", description="Coastal/Low-lying", color="#50f0e6")
        elif elev < 500:
            return TerrainType(type="Plains", description="Flat/Rolling", color="#95afc0")
        elif elev < 1000:
            return TerrainType(type="Hills", description="Hilly/Upland", color="#f9ca24")
        elif elev < 2000:
            return TerrainType(type="Mountains", description="Mountainous", color="#ff6b6b")
        else:
            return TerrainType(type="High Mountains", description="High Altitude", color="#960032")
