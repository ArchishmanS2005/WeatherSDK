from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.ensemble import EnsembleResponse
from ..utils.validators import validate_coordinates

class EnsembleService(BaseService):
    """Service for accessing the Open-Meteo Ensemble API"""
    
    BASE_URL = "https://ensemble-api.open-meteo.com/v1/ensemble"
    
    def get_forecast(
        self,
        lat: float,
        lon: float,
        days: int = 7,
        models: Optional[List[str]] = None
    ) -> EnsembleResponse:
        """
        Get ensemble forecast.
        
        Args:
            lat: Latitude
            lon: Longitude
            days: Forecast days
            models: List of models (e.g. "icon_seamless", "gfs_seamless", "ecmwf_ifs04")
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": ["temperature_2m"], # Default variable, returns all members
            "forecast_days": days,
            "timezone": "auto"
        }
        
        if models:
            params["models"] = ",".join(models)
            
        data = self._request("GET", self.BASE_URL, params=params)
        return EnsembleResponse(**data)
        
    async def get_forecast_async(
        self,
        lat: float,
        lon: float,
        days: int = 7,
        models: Optional[List[str]] = None
    ) -> EnsembleResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": ["temperature_2m"],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        if models:
            params["models"] = ",".join(models)
            
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return EnsembleResponse(**data)
