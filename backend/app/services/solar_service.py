"""Solar Radiation Service - Fetches solar and radiation data from Open-Meteo API"""

from typing import Dict, Any, List
import httpx
from datetime import datetime, timedelta
from app.config import settings

class SolarService:
    """Service for fetching solar radiation data from Open-Meteo API"""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, lat: float, lon: float, endpoint: str) -> str:
        """Generate cache key for solar data"""
        return f"solar_{endpoint}_{lat}_{lon}"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid (1 hour TTL)"""
        if cache_key not in self._cache:
            return False
        
        cached_time, _ = self._cache[cache_key]
        return datetime.now() - cached_time < timedelta(hours=1)
    
    async def get_current_solar_data(
        self,
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get current solar radiation data
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Dictionary containing current solar data
        """
        cache_key = self._get_cache_key(latitude, longitude, "current")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": [
                "shortwave_radiation",
                "direct_radiation",
                "diffuse_radiation",
                "direct_normal_irradiance",
                "global_tilted_irradiance",
                "terrestrial_radiation",
                "shortwave_radiation_instant",
                "diffuse_radiation_instant",
                "direct_normal_irradiance_instant",
                "global_tilted_irradiance_instant"
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
            raise Exception(f"Failed to fetch solar data: {str(e)}")
    
    async def get_solar_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> Dict[str, Any]:
        """
        Get solar radiation forecast
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            days: Number of forecast days
            
        Returns:
            Dictionary containing hourly and daily solar forecast
        """
        cache_key = self._get_cache_key(latitude, longitude, f"forecast_{days}")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": [
                "shortwave_radiation",
                "direct_radiation",
                "diffuse_radiation",
                "direct_normal_irradiance",
                "global_tilted_irradiance",
                "terrestrial_radiation"
            ],
            "daily": [
                "sunrise",
                "sunset",
                "daylight_duration",
                "sunshine_duration",
                "shortwave_radiation_sum"
            ],
            "forecast_days": days,
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
            raise Exception(f"Failed to fetch solar forecast: {str(e)}")
    
    def calculate_solar_potential(self, radiation: float) -> Dict[str, Any]:
        """
        Calculate solar energy potential based on radiation
        
        Args:
            radiation: Solar radiation in W/m²
            
        Returns:
            Dictionary with potential rating and description
        """
        if radiation < 100:
            return {
                "rating": "Very Low",
                "description": "Minimal solar energy potential",
                "color": "#666666",
                "efficiency": "0-10%"
            }
        elif radiation < 300:
            return {
                "rating": "Low",
                "description": "Limited solar energy generation",
                "color": "#f0e641",
                "efficiency": "10-30%"
            }
        elif radiation < 500:
            return {
                "rating": "Moderate",
                "description": "Fair solar energy potential",
                "color": "#50ccaa",
                "efficiency": "30-50%"
            }
        elif radiation < 700:
            return {
                "rating": "Good",
                "description": "Good solar energy generation",
                "color": "#00e400",
                "efficiency": "50-70%"
            }
        elif radiation < 900:
            return {
                "rating": "Very Good",
                "description": "Excellent solar energy potential",
                "color": "#00a000",
                "efficiency": "70-85%"
            }
        else:
            return {
                "rating": "Excellent",
                "description": "Peak solar energy conditions",
                "color": "#007000",
                "efficiency": "85-100%"
            }
    
    def get_best_solar_hours(self, hourly_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Identify the best hours for solar energy generation
        
        Args:
            hourly_data: Hourly solar forecast data
            
        Returns:
            List of best solar hours with radiation values
        """
        if "hourly" not in hourly_data:
            return []
        
        hourly = hourly_data["hourly"]
        times = hourly.get("time", [])
        radiation = hourly.get("shortwave_radiation", [])
        
        if not times or not radiation:
            return []
        
        # Find hours with radiation > 500 W/m²
        best_hours = []
        for i, (time, rad) in enumerate(zip(times, radiation)):
            if rad and rad > 500:
                best_hours.append({
                    "time": time,
                    "radiation": rad,
                    "potential": self.calculate_solar_potential(rad)
                })
        
        # Sort by radiation (highest first)
        best_hours.sort(key=lambda x: x["radiation"], reverse=True)
        
        return best_hours[:10]  # Return top 10 hours
