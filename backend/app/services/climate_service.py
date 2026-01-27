"""
Climate API Service
Provides long-range climate projections using CMIP6 models from Open-Meteo
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from app.config import settings


class ClimateService:
    """Service for climate change projections and long-range forecasts"""
    
    BASE_URL = "https://climate-api.open-meteo.com/v1/climate"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self._cache: Dict[str, tuple[datetime, Any]] = {}
        self.cache_ttl = timedelta(days=7)  # Climate data changes slowly
    
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
    
    async def get_climate_projections(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        models: Optional[list[str]] = None
    ) -> Dict[str, Any]:
        """
        Get climate projections for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            models: List of climate models (default: all available)
        
        Returns:
            Climate projection data with temperature and precipitation
        """
        cache_key = self._get_cache_key(
            "projections", latitude, longitude, start_date, end_date, 
            tuple(models) if models else None
        )
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        # Default models if none specified
        if not models:
            models = ["EC_Earth3P_HR"]
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "models": ",".join(models),
            "daily": [
                "temperature_2m_mean",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "wind_speed_10m_mean",
                "shortwave_radiation_sum"
            ]
        }
        
        response = await self.client.get(self.BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        self._set_cache(cache_key, data)
        return data
    
    async def get_emission_scenarios(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get climate projections for different emission scenarios
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
        
        Returns:
            Climate data for SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5 scenarios
        """
        cache_key = self._get_cache_key(
            "scenarios", latitude, longitude, start_date, end_date
        )
        
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        # Fetch data for multiple emission scenarios
        scenarios = {
            "ssp126": "SSP1-2.6",  # Low emissions
            "ssp245": "SSP2-4.5",  # Medium emissions
            "ssp370": "SSP3-7.0",  # High emissions
            "ssp585": "SSP5-8.5"   # Very high emissions
        }
        
        results = {}
        
        for scenario_key, scenario_name in scenarios.items():
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "start_date": start_date,
                "end_date": end_date,
                "models": "EC_Earth3P_HR",
                "daily": [
                    "temperature_2m_mean",
                    "precipitation_sum"
                ]
            }
            
            try:
                response = await self.client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                results[scenario_name] = response.json()
            except Exception as e:
                results[scenario_name] = {"error": str(e)}
        
        data = {
            "latitude": latitude,
            "longitude": longitude,
            "scenarios": results
        }
        
        self._set_cache(cache_key, data)
        return data
    
    def get_climate_change_summary(self, projection_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate climate change summary statistics
        
        Args:
            projection_data: Raw projection data from API
        
        Returns:
            Summary statistics including trends and changes
        """
        if "daily" not in projection_data:
            return {"error": "No daily data available"}
        
        daily = projection_data["daily"]
        
        # Calculate temperature trends
        temps = [t for t in daily.get("temperature_2m_mean", []) if t is not None]
        if temps:
            avg_temp = sum(temps) / len(temps)
            max_temp = max(temps)
            min_temp = min(temps)
            
            # Simple trend calculation (first vs last quarter)
            quarter_size = len(temps) // 4
            if quarter_size > 0:
                first_quarter_avg = sum(temps[:quarter_size]) / quarter_size
                last_quarter_avg = sum(temps[-quarter_size:]) / quarter_size
                temp_change = last_quarter_avg - first_quarter_avg
            else:
                temp_change = 0
        else:
            avg_temp = max_temp = min_temp = temp_change = 0
        
        # Calculate precipitation trends
        precip = [p for p in daily.get("precipitation_sum", []) if p is not None]
        if precip:
            total_precip = sum(precip)
            avg_precip = total_precip / len(precip)
        else:
            total_precip = avg_precip = 0
        
        return {
            "temperature": {
                "average": round(avg_temp, 2),
                "maximum": round(max_temp, 2),
                "minimum": round(min_temp, 2),
                "projected_change": round(temp_change, 2),
                "trend": "warming" if temp_change > 0 else "cooling" if temp_change < 0 else "stable"
            },
            "precipitation": {
                "total": round(total_precip, 2),
                "average_daily": round(avg_precip, 2)
            }
        }
