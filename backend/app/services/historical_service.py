"""Historical Weather Service - Fetches historical data from Open-Meteo Archive API"""

from typing import Dict, Any, List
import httpx
from datetime import datetime, timedelta
from app.config import settings

class HistoricalWeatherService:
    """Service for fetching historical weather data from Open-Meteo Archive API"""
    
    BASE_URL = "https://archive-api.open-meteo.com/v1/archive"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, lat: float, lon: float, start: str, end: str) -> str:
        """Generate cache key for historical data"""
        return f"historical_{lat}_{lon}_{start}_{end}"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid (24 hours TTL for historical data)"""
        if cache_key not in self._cache:
            return False
        
        cached_time, _ = self._cache[cache_key]
        return datetime.now() - cached_time < timedelta(hours=24)
    
    async def get_historical_weather(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get historical weather data for a date range
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            
        Returns:
            Dictionary containing daily historical weather data
        """
        cache_key = self._get_cache_key(latitude, longitude, start_date, end_date)
        
        if self._is_cache_valid(cache_key):
            _, cached_data = self._cache[cache_key]
            return cached_data
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "daily": [
                "temperature_2m_max",
                "temperature_2m_min",
                "temperature_2m_mean",
                "apparent_temperature_max",
                "apparent_temperature_min",
                "precipitation_sum",
                "rain_sum",
                "snowfall_sum",
                "precipitation_hours",
                "wind_speed_10m_max",
                "wind_gusts_10m_max",
                "wind_direction_10m_dominant",
                "shortwave_radiation_sum",
                "et0_fao_evapotranspiration"
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
            raise Exception(f"Failed to fetch historical weather data: {str(e)}")
    
    async def get_historical_hourly(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get hourly historical weather data
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            
        Returns:
            Dictionary containing hourly historical weather data
        """
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "hourly": [
                "temperature_2m",
                "relative_humidity_2m",
                "precipitation",
                "rain",
                "snowfall",
                "cloud_cover",
                "wind_speed_10m",
                "wind_direction_10m"
            ],
            "timezone": "auto"
        }
        
        try:
            response = await self.client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            return data
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch hourly historical data: {str(e)}")
    
    def calculate_statistics(self, data: List[float]) -> Dict[str, float]:
        """
        Calculate statistical metrics for a dataset
        
        Args:
            data: List of numerical values
            
        Returns:
            Dictionary with min, max, mean, median
        """
        if not data:
            return {"min": 0, "max": 0, "mean": 0, "median": 0}
        
        sorted_data = sorted(data)
        n = len(sorted_data)
        
        return {
            "min": min(data),
            "max": max(data),
            "mean": sum(data) / n,
            "median": sorted_data[n // 2] if n % 2 == 1 else (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
        }
    
    def aggregate_by_month(self, daily_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Aggregate daily data by month
        
        Args:
            daily_data: Daily weather data from API
            
        Returns:
            Dictionary with monthly aggregated data
        """
        if "daily" not in daily_data:
            return {}
        
        daily = daily_data["daily"]
        dates = daily.get("time", [])
        
        monthly_data = {}
        
        for i, date_str in enumerate(dates):
            date = datetime.fromisoformat(date_str)
            month_key = date.strftime("%Y-%m")
            
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "temps_max": [],
                    "temps_min": [],
                    "precipitation": []
                }
            
            if "temperature_2m_max" in daily:
                monthly_data[month_key]["temps_max"].append(daily["temperature_2m_max"][i])
            if "temperature_2m_min" in daily:
                monthly_data[month_key]["temps_min"].append(daily["temperature_2m_min"][i])
            if "precipitation_sum" in daily:
                monthly_data[month_key]["precipitation"].append(daily["precipitation_sum"][i])
        
        # Calculate statistics for each month
        result = {}
        for month, values in monthly_data.items():
            result[month] = {
                "temperature_max": self.calculate_statistics(values["temps_max"]),
                "temperature_min": self.calculate_statistics(values["temps_min"]),
                "precipitation_total": sum(values["precipitation"]) if values["precipitation"] else 0,
                "precipitation_days": sum(1 for p in values["precipitation"] if p > 0.1)
            }
        
        return result
