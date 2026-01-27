"""
Flood API Service
Provides river discharge forecasts and flood risk data from Open-Meteo
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from app.config import settings


class FloodService:
    """Service for flood forecasts and river discharge data"""
    
    BASE_URL = "https://flood-api.open-meteo.com/v1/flood"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
        self.cache_ttl = timedelta(hours=6)  # Flood data updates every 6 hours
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache_key(self, *args) -> str:
        """Generate cache key from arguments"""
        return "|".join(str(arg) for arg in args)
    
    def _get_cached(self, key: str) -> Optional[Any]:
        """Get cached data if still valid"""
        if key in self._cache:
            timestamp, data = self._cache[key]
            if datetime.now() - timestamp < self.cache_ttl:
                return data
        return None
    
    def _set_cache(self, key: str, data: Any):
        """Store data in cache"""
        self._cache[key] = (datetime.now(), data)
    
    async def get_river_discharge_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> Dict[str, Any]:
        """
        Get river discharge forecast for nearest river
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            days: Number of forecast days (max 7)
        
        Returns:
            River discharge forecast data
        """
        cache_key = self._get_cache_key("discharge", latitude, longitude, days)
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "river_discharge",
                "river_discharge_mean",
                "river_discharge_median",
                "river_discharge_max",
                "river_discharge_min",
                "river_discharge_p25",
                "river_discharge_p75"
            ],
            "forecast_days": days
        }
        
        response = await self.client.get(self.BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Add flood risk assessment
        if "daily" in data and "river_discharge" in data["daily"]:
            data["flood_risk"] = self.assess_flood_risk(data["daily"]["river_discharge"])
        
        self._set_cache(cache_key, data)
        return data
    
    async def get_historical_discharge(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get historical river discharge data
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
        
        Returns:
            Historical river discharge data
        """
        cache_key = self._get_cache_key(
            "historical", latitude, longitude, start_date, end_date
        )
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "daily": [
                "river_discharge"
            ]
        }
        
        response = await self.client.get(self.BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        self._set_cache(cache_key, data)
        return data
    
    def assess_flood_risk(self, discharge_values: list[float]) -> Dict[str, Any]:
        """
        Assess flood risk based on discharge values
        
        Args:
            discharge_values: List of river discharge values (m³/s)
        
        Returns:
            Flood risk assessment with level and description
        """
        if not discharge_values:
            return {
                "level": "unknown",
                "description": "No discharge data available",
                "color": "#gray"
            }
        
        max_discharge = max(discharge_values)
        avg_discharge = sum(discharge_values) / len(discharge_values)
        
        # Simple flood risk classification
        # These thresholds are generic and should be calibrated per river
        if max_discharge < 100:
            level = "low"
            description = "Normal river flow, minimal flood risk"
            color = "#50f0e6"
        elif max_discharge < 500:
            level = "moderate"
            description = "Elevated river flow, monitor conditions"
            color = "#f9ca24"
        elif max_discharge < 1000:
            level = "high"
            description = "High river flow, flood risk present"
            color = "#ff6b6b"
        else:
            level = "severe"
            description = "Very high river flow, significant flood risk"
            color = "#960032"
        
        return {
            "level": level,
            "description": description,
            "color": color,
            "max_discharge": round(max_discharge, 2),
            "avg_discharge": round(avg_discharge, 2),
            "unit": "m³/s"
        }
    
    def get_discharge_statistics(self, daily_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate discharge statistics
        
        Args:
            daily_data: Daily discharge data from API
        
        Returns:
            Statistical summary of discharge data
        """
        if "river_discharge" not in daily_data:
            return {"error": "No discharge data available"}
        
        discharge = daily_data["river_discharge"]
        
        return {
            "mean": round(sum(discharge) / len(discharge), 2) if discharge else 0,
            "max": round(max(discharge), 2) if discharge else 0,
            "min": round(min(discharge), 2) if discharge else 0,
            "median": round(sorted(discharge)[len(discharge) // 2], 2) if discharge else 0,
            "unit": "m³/s"
        }
