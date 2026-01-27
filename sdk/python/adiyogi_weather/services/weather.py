from typing import Optional, List, Dict, Any
from .base import BaseService
from ..models.weather import WeatherResponse
from ..utils.validators import validate_coordinates

class WeatherService(BaseService):
    """Service for accessing the Open-Meteo Weather Forecast API"""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    def get_current(
        self,
        lat: float,
        lon: float,
        units: str = "metric"
    ) -> WeatherResponse:
        """
        Get current weather conditions.
        
        Args:
            lat: Latitude
            lon: Longitude
            units: Unit system ("metric" or "imperial")
            
        Returns:
            WeatherResponse object with current data
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                "is_day", "precipitation", "rain", "showers", "snowfall",
                "weather_code", "cloud_cover", "pressure_msl", "surface_pressure",
                "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"
            ],
            "timezone": "auto"
        }
        
        if units == "imperial":
            params["temperature_unit"] = "fahrenheit"
            params["wind_speed_unit"] = "mph"
            params["precipitation_unit"] = "inch"
            
        data = self._request("GET", self.BASE_URL, params=params)
        return WeatherResponse(**data)
        
    async def get_current_async(
        self,
        lat: float,
        lon: float,
        units: str = "metric"
    ) -> WeatherResponse:
        """Async version of get_current"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                "is_day", "precipitation", "rain", "showers", "snowfall",
                "weather_code", "cloud_cover", "pressure_msl", "surface_pressure",
                "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"
            ],
            "timezone": "auto"
        }
        
        if units == "imperial":
            params["temperature_unit"] = "fahrenheit"
            params["wind_speed_unit"] = "mph"
            params["precipitation_unit"] = "inch"
            
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return WeatherResponse(**data)

    def get_forecast(
        self,
        lat: float,
        lon: float,
        days: int = 7,
        units: str = "metric"
    ) -> WeatherResponse:
        """
        Get weather forecast.
        
        Args:
            lat: Latitude
            lon: Longitude
            days: Number of forecast days (1-16)
            units: Unit system
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "temperature_2m", "relative_humidity_2m", "dew_point_2m",
                "apparent_temperature", "precipitation_probability", "precipitation"
            ],
            "daily": [
                "weather_code", "temperature_2m_max", "temperature_2m_min",
                "apparent_temperature_max", "apparent_temperature_min",
                "sunrise", "sunset", "uv_index_max", "precipitation_sum"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        if units == "imperial":
            params["temperature_unit"] = "fahrenheit"
            params["wind_speed_unit"] = "mph"
            params["precipitation_unit"] = "inch"
            
        data = self._request("GET", self.BASE_URL, params=params)
        return WeatherResponse(**data)
        
    async def get_forecast_async(
        self,
        lat: float,
        lon: float,
        days: int = 7,
        units: str = "metric"
    ) -> WeatherResponse:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": [
                "temperature_2m", "relative_humidity_2m", "dew_point_2m",
                "apparent_temperature", "precipitation_probability", "precipitation"
            ],
            "daily": [
                "weather_code", "temperature_2m_max", "temperature_2m_min",
                "apparent_temperature_max", "apparent_temperature_min",
                "sunrise", "sunset", "uv_index_max", "precipitation_sum"
            ],
            "forecast_days": days,
            "timezone": "auto"
        }
        
        if units == "imperial":
            params["temperature_unit"] = "fahrenheit"
            params["wind_speed_unit"] = "mph"
            params["precipitation_unit"] = "inch"
            
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return WeatherResponse(**data)
