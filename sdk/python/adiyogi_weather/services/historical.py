from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.historical import HistoricalResponse
from ..utils.validators import validate_coordinates

class HistoricalService(BaseService):
    """Service for accessing the Open-Meteo Historical Weather API"""
    
    BASE_URL = "https://archive-api.open-meteo.com/v1/archive"
    
    def get_weather(
        self, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> HistoricalResponse:
        """
        Get historical weather data.
        
        Args:
            lat: Latitude
            lon: Longitude
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "daily": [
                "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
                "precipitation_sum", "rain_sum", "snowfall_sum", "wind_speed_10m_max"
            ],
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return HistoricalResponse(**data)
        
    async def get_weather_async(
        self, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> HistoricalResponse:
        """Async version of get_weather"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "daily": [
                "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
                "precipitation_sum", "rain_sum", "snowfall_sum", "wind_speed_10m_max"
            ],
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return HistoricalResponse(**data)
