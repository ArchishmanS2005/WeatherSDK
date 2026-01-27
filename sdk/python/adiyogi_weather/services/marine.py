from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.marine import MarineResponse
from ..utils.validators import validate_coordinates

class MarineService(BaseService):
    """Service for accessing the Open-Meteo Marine API"""
    
    BASE_URL = "https://marine-api.open-meteo.com/v1/marine"
    
    def get_current(self, lat: float, lon: float) -> MarineResponse:
        """Get current marine conditions"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "wave_height", "wave_direction", "wave_period",
                "wind_wave_height", "swell_wave_height"
            ],
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return MarineResponse(**data)
        
    async def get_current_async(self, lat: float, lon: float) -> MarineResponse:
        """Async version of get_current"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "wave_height", "wave_direction", "wave_period",
                "wind_wave_height", "swell_wave_height"
            ],
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return MarineResponse(**data)

    def get_forecast(self, lat: float, lon: float, days: int = 7) -> MarineResponse:
        """Get marine forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "wave_height", "wave_direction", "wave_period"
            ],
            "daily": [
                "wave_height_max", "wave_direction_dominant", "wave_period_max"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return MarineResponse(**data)
