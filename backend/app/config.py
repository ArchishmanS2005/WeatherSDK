from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "https://*.netlify.app",
    ]
    
    # API Settings
    api_timeout_seconds: int = 10
    cache_ttl_seconds: int = 300  # 5 minutes
    
    # Data Source API URLs
    openmeteo_forecast_url: str = "https://api.open-meteo.com/v1/forecast"
    openmeteo_geocoding_url: str = "https://geocoding-api.open-meteo.com/v1/search"
    
    # Weather Settings
    default_temperature_unit: str = "metric"  # metric or imperial
    default_wind_speed_unit: str = "kmh"  # kmh or mph
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

