"""Air Quality Service - Fetches AQI and pollutant data from Open-Meteo Air Quality API"""

from typing import Dict, Any, Optional
import httpx
from datetime import datetime, timedelta
from app.config import settings

class AirQualityService:
    """Service for fetching air quality data from Open-Meteo Air Quality API"""
    
    BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, lat: float, lon: float, endpoint: str) -> str:
        """Generate cache key for air quality data"""
        return f"aqi_{endpoint}_{lat}_{lon}"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid (30 minutes TTL for AQI)"""
        if cache_key not in self._cache:
            return False
        
        cached_time, _ = self._cache[cache_key]
        return datetime.now() - cached_time < timedelta(minutes=30)
    
    async def get_current_air_quality(
        self,
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get current air quality data
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Dictionary containing current air quality data
        """
        cache_key = self._get_cache_key(latitude, longitude, "current")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": [
                "pm10",
                "pm2_5",
                "carbon_monoxide",
                "nitrogen_dioxide",
                "sulphur_dioxide",
                "ozone",
                "aerosol_optical_depth",
                "dust",
                "uv_index",
                "european_aqi",
                "us_aqi"
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
            raise Exception(f"Failed to fetch air quality data: {str(e)}")
    
    async def get_air_quality_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 5
    ) -> Dict[str, Any]:
        """
        Get air quality forecast
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            days: Number of forecast days (max 5)
            
        Returns:
            Dictionary containing hourly air quality forecast
        """
        cache_key = self._get_cache_key(latitude, longitude, f"forecast_{days}")
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": [
                "pm10",
                "pm2_5",
                "carbon_monoxide",
                "nitrogen_dioxide",
                "sulphur_dioxide",
                "ozone",
                "aerosol_optical_depth",
                "dust",
                "uv_index",
                "european_aqi",
                "us_aqi"
            ],
            "forecast_days": min(days, 5),
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
            raise Exception(f"Failed to fetch air quality forecast: {str(e)}")
    
    def get_aqi_category(self, aqi: float, aqi_type: str = "european") -> Dict[str, str]:
        """
        Get AQI category and health recommendation
        
        Args:
            aqi: AQI value
            aqi_type: "european" or "us"
            
        Returns:
            Dictionary with category, color, and recommendation
        """
        if aqi_type == "european":
            if aqi <= 20:
                return {
                    "category": "Good",
                    "color": "#50f0e6",
                    "recommendation": "Air quality is excellent. Perfect for outdoor activities."
                }
            elif aqi <= 40:
                return {
                    "category": "Fair",
                    "color": "#50ccaa",
                    "recommendation": "Air quality is acceptable for most people."
                }
            elif aqi <= 60:
                return {
                    "category": "Moderate",
                    "color": "#f0e641",
                    "recommendation": "Sensitive individuals should consider reducing prolonged outdoor exertion."
                }
            elif aqi <= 80:
                return {
                    "category": "Poor",
                    "color": "#ff5050",
                    "recommendation": "Everyone may begin to experience health effects. Reduce outdoor activities."
                }
            elif aqi <= 100:
                return {
                    "category": "Very Poor",
                    "color": "#960032",
                    "recommendation": "Health alert. Everyone should avoid outdoor activities."
                }
            else:
                return {
                    "category": "Extremely Poor",
                    "color": "#7d2181",
                    "recommendation": "Health warning. Stay indoors and keep windows closed."
                }
        else:  # US AQI
            if aqi <= 50:
                return {
                    "category": "Good",
                    "color": "#00e400",
                    "recommendation": "Air quality is satisfactory. Enjoy outdoor activities!"
                }
            elif aqi <= 100:
                return {
                    "category": "Moderate",
                    "color": "#ffff00",
                    "recommendation": "Acceptable air quality. Unusually sensitive people should consider limiting prolonged outdoor exertion."
                }
            elif aqi <= 150:
                return {
                    "category": "Unhealthy for Sensitive Groups",
                    "color": "#ff7e00",
                    "recommendation": "Sensitive groups should reduce prolonged outdoor exertion."
                }
            elif aqi <= 200:
                return {
                    "category": "Unhealthy",
                    "color": "#ff0000",
                    "recommendation": "Everyone should reduce prolonged outdoor exertion."
                }
            elif aqi <= 300:
                return {
                    "category": "Very Unhealthy",
                    "color": "#8f3f97",
                    "recommendation": "Health alert. Everyone should avoid outdoor activities."
                }
            else:
                return {
                    "category": "Hazardous",
                    "color": "#7e0023",
                    "recommendation": "Health warning. Stay indoors with air purification if possible."
                }
