from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.historical_forecast import HistoricalForecastResponse
from ..utils.validators import validate_coordinates

class HistoricalForecastService(BaseService):
    """
    Service for accessing the Open-Meteo Historical Forecast API.
    This API provides previous weather forecasts (past predictions) from various models.
    """
    
    BASE_URL = "https://historical-forecast-api.open-meteo.com/v1/forecast"
    
    def get_forecast(
        self,
        lat: float,
        lon: float,
        start_date: str, 
        end_date: str,
        hourly: Optional[List[str]] = None,
        models: Optional[List[str]] = None
    ) -> HistoricalForecastResponse:
        """
        Get historical weather forecasts (past predictions).
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "hourly": hourly or ["temperature_2m", "relative_humidity_2m", "precipitation"],
            "timezone": "auto"
        }
        
        if models:
            params["models"] = ",".join(models)
            
        data = self._request("GET", self.BASE_URL, params=params)
        return HistoricalForecastResponse(**data)
        
    async def get_forecast_async(
        self,
        lat: float,
        lon: float,
        start_date: str, 
        end_date: str,
        hourly: Optional[List[str]] = None,
        models: Optional[List[str]] = None
    ) -> HistoricalForecastResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "hourly": hourly or ["temperature_2m", "relative_humidity_2m", "precipitation"],
            "timezone": "auto"
        }
        
        if models:
            params["models"] = ",".join(models)
            
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return HistoricalForecastResponse(**data)
