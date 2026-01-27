from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.climate import ClimateProjection, ClimateChangeSummary, TemperatureChange, PrecipitationChange
from ..utils.validators import validate_coordinates

class ClimateService(BaseService):
    """Service for accessing the Open-Meteo Climate API"""
    
    BASE_URL = "https://climate-api.open-meteo.com/v1/climate"
    
    def get_projections(
        self,
        lat: float,
        lon: float,
        start_date: str,
        end_date: str,
        models: Optional[List[str]] = None
    ) -> ClimateProjection:
        """
        Get climate projections.
        
        Args:
            lat: Latitude
            lon: Longitude
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            models: List of climate models (default: EC_Earth3P_HR)
        """
        validate_coordinates(lat, lon)
        
        if not models:
            models = ["EC_Earth3P_HR"]
            
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "models": ",".join(models),
            "daily": [
                "temperature_2m_mean", "temperature_2m_max", "temperature_2m_min",
                "precipitation_sum", "wind_speed_10m_mean", "shortwave_radiation_sum"
            ]
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        return ClimateProjection(**data)

    async def get_projections_async(
        self,
        lat: float,
        lon: float,
        start_date: str,
        end_date: str,
        models: Optional[List[str]] = None
    ) -> ClimateProjection:
        """Async version of get_projections"""
        validate_coordinates(lat, lon)
        
        if not models:
            models = ["EC_Earth3P_HR"]
            
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "models": ",".join(models),
            "daily": [
                "temperature_2m_mean", "temperature_2m_max", "temperature_2m_min",
                "precipitation_sum", "wind_speed_10m_mean", "shortwave_radiation_sum"
            ]
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        return ClimateProjection(**data)

    def get_summary(self, projection: ClimateProjection) -> ClimateChangeSummary:
        """Calculate climate change summary from projection data"""
        daily = projection.daily
        
        # Temp analysis
        temps = [t for t in (daily.temperature_2m_mean or []) if t is not None]
        if temps:
            avg_temp = sum(temps) / len(temps)
            max_temp = max(temps)
            min_temp = min(temps)
            
            quarter = len(temps) // 4
            if quarter > 0:
                first = sum(temps[:quarter]) / quarter
                last = sum(temps[-quarter:]) / quarter
                change = last - first
            else:
                change = 0
        else:
            avg_temp = max_temp = min_temp = change = 0
            
        temp_stats = TemperatureChange(
            average=round(avg_temp, 2),
            maximum=round(max_temp, 2),
            minimum=round(min_temp, 2),
            projected_change=round(change, 2),
            trend="warming" if change > 0 else "cooling" if change < 0 else "stable"
        )
        
        # Precip analysis
        precip = [p for p in (daily.precipitation_sum or []) if p is not None]
        if precip:
            total = sum(precip)
            daily_avg = total / len(precip)
        else:
            total = daily_avg = 0
            
        precip_stats = PrecipitationChange(
            total=round(total, 2),
            average_daily=round(daily_avg, 2)
        )
        
        return ClimateChangeSummary(temperature=temp_stats, precipitation=precip_stats)
