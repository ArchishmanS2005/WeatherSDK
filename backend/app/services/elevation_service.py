"""
Elevation API Service
Provides accurate elevation data for any location from Open-Meteo
"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import httpx
from app.config import settings


class ElevationService:
    """Service for elevation and terrain data"""
    
    BASE_URL = "https://api.open-meteo.com/v1/elevation"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
        self.cache_ttl = timedelta(days=30)  # Elevation data doesn't change
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, *args) -> str:
        """Generate cache key from arguments"""
        return "|".join(str(arg) for arg in args)
    
    def _get_cached(self, key: str) -> Optional[Any]:
        """Get cached data if still valid"""
        if key in self._cache:
            timestamp, data = self._cache[key]
            if datetime.now() - timestamp < self.cache_ttl:
                return data
        return None
    
    def _set_cache(self, key: str, data: Any):
        """Store data in cache"""
        self._cache[key] = (datetime.now(), data)
    
    async def get_elevation(
        self,
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get elevation for a single point
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
        
        Returns:
            Elevation data in meters above sea level
        """
        cache_key = self._get_cache_key("single", latitude, longitude)
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        params = {
            "latitude": latitude,
            "longitude": longitude
        }
        
        response = await self.client.get(self.BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Add terrain classification
        if "elevation" in data:
            elevation = data["elevation"][0] if isinstance(data["elevation"], list) else data["elevation"]
            data["terrain_type"] = self.classify_terrain(elevation)
            data["elevation_meters"] = elevation
            data["elevation_feet"] = round(elevation * 3.28084, 2)
        
        self._set_cache(cache_key, data)
        return data
    
    async def get_elevation_batch(
        self,
        coordinates: List[Dict[str, float]]
    ) -> Dict[str, Any]:
        """
        Get elevation for multiple points
        
        Args:
            coordinates: List of {"lat": float, "lon": float} dictionaries
        
        Returns:
            Elevation data for all points
        """
        # Build comma-separated lists
        latitudes = ",".join(str(coord["lat"]) for coord in coordinates)
        longitudes = ",".join(str(coord["lon"]) for coord in coordinates)
        
        cache_key = self._get_cache_key("batch", latitudes, longitudes)
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        params = {
            "latitude": latitudes,
            "longitude": longitudes
        }
        
        response = await self.client.get(self.BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Add terrain classification for each point
        if "elevation" in data:
            elevations = data["elevation"]
            data["terrain_types"] = [
                self.classify_terrain(elev) for elev in elevations
            ]
            data["elevation_feet"] = [
                round(elev * 3.28084, 2) for elev in elevations
            ]
        
        self._set_cache(cache_key, data)
        return data
    
    def classify_terrain(self, elevation: float) -> Dict[str, str]:
        """
        Classify terrain type based on elevation
        
        Args:
            elevation: Elevation in meters above sea level
        
        Returns:
            Terrain classification with type and description
        """
        if elevation < 0:
            return {
                "type": "Below Sea Level",
                "description": "Depression or underwater",
                "color": "#4ecdc4"
            }
        elif elevation < 200:
            return {
                "type": "Lowland",
                "description": "Coastal or low-lying area",
                "color": "#50f0e6"
            }
        elif elevation < 500:
            return {
                "type": "Plains",
                "description": "Flat or gently rolling terrain",
                "color": "#95afc0"
            }
        elif elevation < 1000:
            return {
                "type": "Hills",
                "description": "Hilly or upland terrain",
                "color": "#f9ca24"
            }
        elif elevation < 2000:
            return {
                "type": "Mountains",
                "description": "Mountainous terrain",
                "color": "#ff6b6b"
            }
        elif elevation < 4000:
            return {
                "type": "High Mountains",
                "description": "High altitude mountains",
                "color": "#960032"
            }
        else:
            return {
                "type": "Very High Mountains",
                "description": "Extreme altitude terrain",
                "color": "#7d2181"
            }
    
    def get_elevation_profile(
        self,
        elevations: List[float],
        coordinates: List[Dict[str, float]]
    ) -> Dict[str, Any]:
        """
        Generate elevation profile statistics
        
        Args:
            elevations: List of elevation values
            coordinates: List of coordinate dictionaries
        
        Returns:
            Profile statistics including min, max, range, etc.
        """
        if not elevations:
            return {"error": "No elevation data available"}
        
        min_elev = min(elevations)
        max_elev = max(elevations)
        avg_elev = sum(elevations) / len(elevations)
        
        # Find indices of min and max
        min_idx = elevations.index(min_elev)
        max_idx = elevations.index(max_elev)
        
        return {
            "minimum": {
                "elevation_m": round(min_elev, 2),
                "elevation_ft": round(min_elev * 3.28084, 2),
                "location": coordinates[min_idx] if min_idx < len(coordinates) else None
            },
            "maximum": {
                "elevation_m": round(max_elev, 2),
                "elevation_ft": round(max_elev * 3.28084, 2),
                "location": coordinates[max_idx] if max_idx < len(coordinates) else None
            },
            "average": {
                "elevation_m": round(avg_elev, 2),
                "elevation_ft": round(avg_elev * 3.28084, 2)
            },
            "range": {
                "elevation_m": round(max_elev - min_elev, 2),
                "elevation_ft": round((max_elev - min_elev) * 3.28084, 2)
            },
            "total_points": len(elevations)
        }
