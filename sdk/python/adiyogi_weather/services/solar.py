from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.solar import SolarResponse
from ..utils.validators import validate_coordinates

class SolarService(BaseService):
    """Service for accessing the Open-Meteo Solar API (via Weather forecast)"""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    def get_forecast(self, lat: float, lon: float, days: int = 7) -> SolarResponse:
        """Get solar radiation forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "shortwave_radiation", "direct_radiation", "diffuse_radiation",
                "direct_normal_irradiance", "global_tilted_irradiance", "terrestrial_radiation"
            ],
            "daily": ["shortwave_radiation_sum"],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return SolarResponse(**data)
        
    async def get_forecast_async(self, lat: float, lon: float, days: int = 7) -> SolarResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "shortwave_radiation", "direct_radiation", "diffuse_radiation",
                "direct_normal_irradiance", "global_tilted_irradiance", "terrestrial_radiation"
            ],
            "daily": ["shortwave_radiation_sum"],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return SolarResponse(**data)
