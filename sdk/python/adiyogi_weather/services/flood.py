from typing import List, Optional, Dict, Any
from .base import BaseService
from ..models.flood import FloodForecast, FloodRisk
from ..utils.validators import validate_coordinates

class FloodService(BaseService):
    """Service for accessing the Open-Meteo Flood API"""
    
    BASE_URL = "https://flood-api.open-meteo.com/v1/flood"
    
    def get_forecast(
        self,
        lat: float,
        lon: float,
        days: int = 7
    ) -> FloodForecast:
        """
        Get river discharge forecast.
        
        Args:
            lat: Latitude
            lon: Longitude
            days: Number of forecast days (max 7)
        """
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": [
                "river_discharge", "river_discharge_mean", "river_discharge_median",
                "river_discharge_max", "river_discharge_min",
                "river_discharge_p25", "river_discharge_p75"
            ],
            "forecast_days": days
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        
        # Calculate risk (client-side logic similar to backend)
        risk = self._assess_risk(data.get("daily", {}).get("river_discharge", []))
        if risk:
            data["flood_risk"] = risk
            
        return FloodForecast(**data)

    async def get_forecast_async(
        self,
        lat: float,
        lon: float,
        days: int = 7
    ) -> FloodForecast:
        """Async version of get_forecast"""
        validate_coordinates(lat, lon)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": [
                "river_discharge", "river_discharge_mean", "river_discharge_median",
                "river_discharge_max", "river_discharge_min",
                "river_discharge_p25", "river_discharge_p75"
            ],
            "forecast_days": days
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        
        risk = self._assess_risk(data.get("daily", {}).get("river_discharge", []))
        if risk:
            data["flood_risk"] = risk
            
        return FloodForecast(**data)
        
    def _assess_risk(self, discharge_values: List[float]) -> Optional[Dict[str, Any]]:
        """Assess flood risk based on discharge values"""
        if not discharge_values:
            return None
            
        discharge = [d for d in discharge_values if d is not None]
        if not discharge:
            return None
            
        max_d = max(discharge)
        avg_d = sum(discharge) / len(discharge)
        
        if max_d < 100:
            level = "low"
            desc = "Normal river flow"
            color = "#50f0e6"
        elif max_d < 500:
            level = "moderate"
            desc = "Elevated river flow"
            color = "#f9ca24"
        elif max_d < 1000:
            level = "high"
            desc = "High flood risk"
            color = "#ff6b6b"
        else:
            level = "severe"
            desc = "Severe flood risk"
            color = "#960032"
            
        return {
            "level": level,
            "description": desc,
            "color": color,
            "max_discharge": max_d,
            "avg_discharge": avg_d,
            "unit": "m³/s"
        }
