"""Marine Weather Service - Fetches ocean/marine data from Open-Meteo Marine API"""

from typing import Dict, Any
import httpx
from datetime import datetime, timedelta
from app.config import settings

class MarineService:
    """Service for fetching marine weather data from Open-Meteo Marine API"""
    
    BASE_URL = "https://marine-api.open-meteo.com/v1/marine"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, lat: float, lon: float, endpoint: str) -> str:
        """Generate cache key for marine data"""
        return f"marine_{endpoint}_{lat}_{lon}"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid (1 hour TTL for marine data)"""
        if cache_key not in self._cache:
            return False
        
        cached_time, _ = self._cache[cache_key]
        return datetime.now() - cached_time < timedelta(hours=1)
    
    async def get_current_marine_conditions(
        self,
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get current marine conditions
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Dictionary containing current marine data
        """
        cache_key = self._get_cache_key(latitude, longitude, "current")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": [
                "wave_height",
                "wave_direction",
                "wave_period",
                "wind_wave_height",
                "swell_wave_height",
                "swell_wave_direction",
                "swell_wave_period",
                "ocean_current_velocity",
                "ocean_current_direction"
            ],
            "timezone": "auto"
        }
        
        try:
            response = await self.client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Cache the result
            self._cache[cache_key] = (datetime.now(), data)
            
            return data
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch marine conditions: {str(e)}")
    
    async def get_marine_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> Dict[str, Any]:
        """
        Get marine weather forecast
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            days: Number of forecast days (max 7)
            
        Returns:
            Dictionary containing hourly and daily marine forecast
        """
        cache_key = self._get_cache_key(latitude, longitude, f"forecast_{days}")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": [
                "wave_height",
                "wave_direction",
                "wave_period",
                "wind_wave_height",
                "wind_wave_direction",
                "wind_wave_period",
                "swell_wave_height",
                "swell_wave_direction",
                "swell_wave_period",
                "ocean_current_velocity",
                "ocean_current_direction"
            ],
            "daily": [
                "wave_height_max",
                "wave_direction_dominant",
                "wave_period_max",
                "wind_wave_height_max",
                "swell_wave_height_max"
            ],
            "forecast_days": min(days, 7),
            "timezone": "auto"
        }
        
        try:
            response = await self.client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Cache the result
            self._cache[cache_key] = (datetime.now(), data)
            
            return data
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch marine forecast: {str(e)}")
    
    def get_wave_conditions_description(self, wave_height: float) -> Dict[str, str]:
        """
        Get wave conditions description based on wave height
        
        Args:
            wave_height: Wave height in meters
            
        Returns:
            Dictionary with condition and description
        """
        if wave_height < 0.5:
            return {
                "condition": "Calm",
                "description": "Smooth water, ideal for all water activities",
                "color": "#00e400"
            }
        elif wave_height < 1.25:
            return {
                "condition": "Slight",
                "description": "Small waves, good for most activities",
                "color": "#50ccaa"
            }
        elif wave_height < 2.5:
            return {
                "condition": "Moderate",
                "description": "Moderate waves, suitable for experienced sailors",
                "color": "#f0e641"
            }
        elif wave_height < 4.0:
            return {
                "condition": "Rough",
                "description": "Large waves, challenging conditions",
                "color": "#ff7e00"
            }
        elif wave_height < 6.0:
            return {
                "condition": "Very Rough",
                "description": "Very large waves, dangerous for small craft",
                "color": "#ff0000"
            }
        else:
            return {
                "condition": "High/Phenomenal",
                "description": "Extremely dangerous conditions, avoid navigation",
                "color": "#7e0023"
            }
