import httpx
from typing import Optional, Dict, Any
from .exceptions import ConfigurationError
from .services.weather import WeatherService
from .services.climate import ClimateService
from .services.flood import FloodService
from .services.elevation import ElevationService
from .services.air_quality import AirQualityService
from .services.marine import MarineService
from .services.historical import HistoricalService
from .services.geocoding import GeocodingService
from .services.solar import SolarService
from .services.ensemble import EnsembleService
from .services.seasonal import SeasonalService
from .services.historical_forecast import HistoricalForecastService

class WeatherSDK:
    """
    Main SDK Client for Adiyogi Weather Platform.
    Access all weather services through this client.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 10,
        cache_enabled: bool = True,
        max_retries: int = 3
    ):
        """
        Initialize the Weather SDK.

        Args:
            api_key: Optional API key for future use (not currently required for Open-Meteo)
            base_url: Base URL for the services (default: official Open-Meteo URLs)
            timeout: Request timeout in seconds (default: 10)
            cache_enabled: Whether to enable in-memory caching (default: True)
            max_retries: Number of retries for failed requests (default: 3)
        """
        self.timeout = timeout
        self.cache_enabled = cache_enabled
        self.max_retries = max_retries
        
        # Initialize HTTP client
        self._client = httpx.Client(timeout=timeout)
        self._async_client = httpx.AsyncClient(timeout=timeout)
        
        # Initialize Services
        self.weather = WeatherService(self)
        self.climate = ClimateService(self)
        self.flood = FloodService(self)
        self.elevation = ElevationService(self)
        self.air_quality = AirQualityService(self)
        self.marine = MarineService(self)
        self.historical = HistoricalService(self)
        self.geocoding = GeocodingService(self)
        self.solar = SolarService(self)
        self.ensemble = EnsembleService(self)
        self.seasonal = SeasonalService(self)
        self.historical_forecast = HistoricalForecastService(self)
        
    def close(self):
        """Close the synchronous HTTP client"""
        self._client.close()
        
    async def aclose(self):
        """Close the asynchronous HTTP client"""
        await self._async_client.aclose()
