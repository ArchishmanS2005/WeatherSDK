from typing import List, Optional, Any
from .base import BaseService
from ..models.seasonal import SeasonalResponse
from ..utils.validators import validate_coordinates

class SeasonalService(BaseService):
    """Service for accessing the Open-Meteo Seasonal Forecast API (ECMWF SEAS5)"""
    
    BASE_URL = "https://seasonal-api.open-meteo.com/v1/seasonal"
    
    def get_forecast(
        self,
        lat: float,
        lon: float,
        daily: Optional[List[str]] = None
    ) -> SeasonalResponse:
        """
        Get seasonal forecast (up to 7 months).
        
        Args:
            lat: Latitude
            lon: Longitude
            daily: List of variables (default: ["temperature_2m_max", "temperature_2m_min"])
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": daily or ["temperature_2m_max", "temperature_2m_min"],
            "timezone": "auto"
        }
            
        data = self._request("GET", self.BASE_URL, params=params)
        return SeasonalResponse(**data)
        
    async def get_forecast_async(
        self,
        lat: float,
        lon: float,
        daily: Optional[List[str]] = None
    ) -> SeasonalResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": daily or ["temperature_2m_max", "temperature_2m_min"],
            "timezone": "auto"
        }
            
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return SeasonalResponse(**data)
