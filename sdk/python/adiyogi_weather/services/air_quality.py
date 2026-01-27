from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.air_quality import AirQualityResponse
from ..utils.validators import validate_coordinates

class AirQualityService(BaseService):
    """Service for accessing the Open-Meteo Air Quality API"""
    
    BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
    
    def get_current(self, lat: float, lon: float) -> AirQualityResponse:
        """Get current air quality"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)
        
    async def get_current_async(self, lat: float, lon: float) -> AirQualityResponse:
        """Async version of get_current"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)

    def get_forecast(self, lat: float, lon: float, days: int = 5) -> AirQualityResponse:
        """Get air quality forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)
        
    async def get_forecast_async(self, lat: float, lon: float, days: int = 5) -> AirQualityResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)

    def get_historical(
        self, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> AirQualityResponse:
        """
        Get historical air quality data.
        
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
            "hourly": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "start_date": start_date,
            "end_date": end_date,
            "timezone": "auto"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)
        
    async def get_historical_async(
        self, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> AirQualityResponse:
        """Async version of get_historical"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi", "us_aqi"
            ],
            "start_date": start_date,
            "end_date": end_date,
            "timezone": "auto"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return AirQualityResponse(**data)
