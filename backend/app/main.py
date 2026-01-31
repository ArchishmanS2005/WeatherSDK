# Weather API - Main Application (Reload Triggered 2)
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.services.weather_service import weather_service
from app.services.air_quality_service import AirQualityService
from app.services.marine_service import MarineService
from app.services.historical_service import HistoricalWeatherService
from app.services.solar_service import SolarService
from app.services.climate_service import ClimateService
from app.services.flood_service import FloodService
from app.services.elevation_service import ElevationService
from app.models import (
    LocationSearchResponse,
    CurrentWeatherResponse,
    ForecastResponse,
    ErrorResponse,
)

# Initialize services
air_quality_service = AirQualityService()
marine_service = MarineService()
historical_service = HistoricalWeatherService()
solar_service = SolarService()
climate_service = ClimateService()
flood_service = FloodService()
elevation_service = ElevationService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    yield
    # Shutdown
    await weather_service.close()
    await air_quality_service.close()
    await marine_service.close()
    await historical_service.close()
    await solar_service.close()
    await climate_service.close()
    await flood_service.close()
    await elevation_service.close()


# Initialize FastAPI app
app = FastAPI(
    title="Adiyogi Weather API",
    description="High-precision weather, climate, and environmental data API with Air Quality, Marine, Historical & Solar Data",
    version="2.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(message=exc.detail).model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(message=str(exc)).model_dump(),
    )


# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "status": "ok",
        "message": "Advanced Weather API is running",
        "version": "3.1.0",
        "features": [
            "Weather Forecast",
            "Air Quality Index",
            "Marine Weather",
            "Historical Data (1940-present)",
            "Solar Radiation",
            "Climate Projections",
            "Flood Forecasts",
            "Elevation Data"
        ],
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ============================================================================
# WEATHER API ENDPOINTS
# ============================================================================

@app.get("/api/geocoding/search", response_model=LocationSearchResponse)
async def search_location(
    query: str = Query(..., description="City name or location to search"),
    count: int = Query(10, ge=1, le=100, description="Number of results to return"),
):
    """
    Search for locations using Open-Meteo Geocoding API
    
    Returns a list of matching locations with coordinates and timezone information.
    """
    try:
        result = await weather_service.search_location(query, count)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/geocoding/reverse")
async def reverse_geocode(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """
    Get location name for specific coordinates
    """
    try:
        result = await weather_service.reverse_geocode(lat, lon)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/weather/current", response_model=CurrentWeatherResponse)
async def get_current_weather(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    units: str = Query("metric", regex="^(metric|imperial)$", description="Unit system"),
):
    """
    Get current weather conditions for specified coordinates
    
    Returns current temperature, weather conditions, wind, humidity, and more.
    """
    try:
        result = await weather_service.get_current_weather(lat, lon, units)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/weather/forecast", response_model=ForecastResponse)
async def get_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(7, ge=1, le=16, description="Number of forecast days"),
    units: str = Query("metric", regex="^(metric|imperial)$", description="Unit system"),
):
    """
    Get hourly and daily weather forecast for specified coordinates
    
    Returns up to 16 days of forecast data including hourly and daily summaries.
    """
    try:
        result = await weather_service.get_forecast(lat, lon, days, units)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# AIR QUALITY API ENDPOINTS
# ============================================================================

@app.get("/api/air-quality/current")
async def get_current_air_quality(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """
    Get current air quality data including AQI and pollutant levels
    
    Returns European AQI, US AQI, PM2.5, PM10, NO2, O3, SO2, CO, dust, and UV index.
    """
    try:
        data = await air_quality_service.get_current_air_quality(lat, lon)
        
        # Add category information if AQI is available
        if "current" in data:
            current = data["current"]
            if "european_aqi" in current and current["european_aqi"] is not None:
                data["european_aqi_category"] = air_quality_service.get_aqi_category(
                    current["european_aqi"], "european"
                )
            if "us_aqi" in current and current["us_aqi"] is not None:
                data["us_aqi_category"] = air_quality_service.get_aqi_category(
                    current["us_aqi"], "us"
                )
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/air-quality/forecast")
async def get_air_quality_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(5, ge=1, le=5, description="Number of forecast days"),
):
    """
    Get air quality forecast for up to 5 days
    
    Returns hourly AQI and pollutant forecasts.
    """
    try:
        result = await air_quality_service.get_air_quality_forecast(lat, lon, days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# MARINE WEATHER API ENDPOINTS
# ============================================================================

@app.get("/api/marine/current")
async def get_current_marine_conditions(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """
    Get current marine conditions including waves, currents, and tides
    
    Returns wave height, direction, period, swell, and ocean currents.
    """
    try:
        data = await marine_service.get_current_marine_conditions(lat, lon)
        
        # Add wave condition description
        if "current" in data and "wave_height" in data["current"]:
            wave_height = data["current"]["wave_height"]
            if wave_height is not None:
                data["wave_conditions"] = marine_service.get_wave_conditions_description(wave_height)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/marine/forecast")
async def get_marine_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(7, ge=1, le=7, description="Number of forecast days"),
):
    """
    Get marine weather forecast for up to 7 days
    
    Returns hourly and daily marine forecasts including waves, currents, and tides.
    """
    try:
        result = await marine_service.get_marine_forecast(lat, lon, days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# HISTORICAL WEATHER API ENDPOINTS
# ============================================================================

@app.get("/api/historical/weather")
async def get_historical_weather(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
):
    """
    Get historical weather data for a date range (1940-present)
    
    Returns daily historical data including temperature, precipitation, wind, and more.
    """
    try:
        result = await historical_service.get_historical_weather(lat, lon, start_date, end_date)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/historical/hourly")
async def get_historical_hourly(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
):
    """
    Get hourly historical weather data
    
    Returns hourly data for temperature, humidity, precipitation, wind, and cloud cover.
    """
    try:
        result = await historical_service.get_historical_hourly(lat, lon, start_date, end_date)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/historical/stats")
async def get_historical_stats(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
):
    """
    Get historical weather statistics aggregated by month
    
    Returns monthly statistics including min/max/mean temperatures and precipitation totals.
    """
    try:
        # Get daily data
        daily_data = await historical_service.get_historical_weather(lat, lon, start_date, end_date)
        
        # Aggregate by month
        monthly_stats = historical_service.aggregate_by_month(daily_data)
        
        return {
            "latitude": daily_data.get("latitude"),
            "longitude": daily_data.get("longitude"),
            "start_date": start_date,
            "end_date": end_date,
            "monthly_statistics": monthly_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# SOLAR RADIATION API ENDPOINTS
# ============================================================================

@app.get("/api/solar/current")
async def get_current_solar_data(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """
    Get current solar radiation data
    
    Returns shortwave radiation, direct/diffuse radiation, DNI, GHI, and terrestrial radiation.
    """
    try:
        data = await solar_service.get_current_solar_data(lat, lon)
        
        # Add solar potential if radiation is available
        if "current" in data and "shortwave_radiation" in data["current"]:
            radiation = data["current"]["shortwave_radiation"]
            if radiation is not None:
                data["solar_potential"] = solar_service.calculate_solar_potential(radiation)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/solar/forecast")
async def get_solar_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(7, ge=1, le=16, description="Number of forecast days"),
):
    """
    Get solar radiation forecast
    
    Returns hourly and daily solar radiation forecasts including sunrise/sunset and sunshine duration.
    """
    try:
        data = await solar_service.get_solar_forecast(lat, lon, days)
        
        # Add best solar hours
        best_hours = solar_service.get_best_solar_hours(data)
        data["best_solar_hours"] = best_hours
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# CLIMATE API ENDPOINTS
# ============================================================================

@app.get("/api/climate/projections")
async def get_climate_projections(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    models: str = Query(None, description="Comma-separated climate models")
):
    """Get climate projections for a location"""
    try:
        model_list = models.split(",") if models else None
        data = await climate_service.get_climate_projections(
            lat, lon, start_date, end_date, model_list
        )
        
        # Add summary statistics
        if "daily" in data:
            data["summary"] = climate_service.get_climate_change_summary(data)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/climate/scenarios")
async def get_emission_scenarios(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)")
):
    """Get climate projections for different emission scenarios"""
    try:
        data = await climate_service.get_emission_scenarios(lat, lon, start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# FLOOD API ENDPOINTS
# ============================================================================

@app.get("/api/flood/forecast")
async def get_flood_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(7, ge=1, le=7, description="Forecast days")
):
    """Get river discharge forecast and flood risk"""
    try:
        data = await flood_service.get_river_discharge_forecast(lat, lon, days)
        
        # Add statistics
        if "daily" in data:
            data["statistics"] = flood_service.get_discharge_statistics(data["daily"])
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/flood/historical")
async def get_historical_discharge(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)")
):
    """Get historical river discharge data"""
    try:
        data = await flood_service.get_historical_discharge(lat, lon, start_date, end_date)
        
        # Add statistics
        if "daily" in data:
            data["statistics"] = flood_service.get_discharge_statistics(data["daily"])
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ELEVATION API ENDPOINTS
# ============================================================================

@app.get("/api/elevation")
async def get_elevation(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude")
):
    """Get elevation for a single point"""
    try:
        data = await elevation_service.get_elevation(lat, lon)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/elevation/batch")
async def get_elevation_batch(coordinates: list[dict]):
    """Get elevation for multiple points"""
    try:
        data = await elevation_service.get_elevation_batch(coordinates)
        
        # Add profile statistics
        if "elevation" in data:
            data["profile"] = elevation_service.get_elevation_profile(
                data["elevation"],
                coordinates
            )
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
