import httpx
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from app.config import settings
from app.models import (
    LocationSearchResponse,
    LocationResult,
    CurrentWeatherResponse,
    CurrentWeather,
    ForecastResponse,
    HourlyForecast,
    DailyForecast,
    LocationInfo,
    WeatherUnits,
    WeatherCode,
    ReverseGeocodeResponse,
)


class WeatherService:
    """Service for fetching weather data"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=settings.api_timeout_seconds)
        self.cache: Dict[str, tuple[Any, datetime]] = {}
        
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def _get_cache(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if datetime.utcnow() - timestamp < timedelta(seconds=settings.cache_ttl_seconds):
                return value
            else:
                del self.cache[key]
        return None
    
    def _set_cache(self, key: str, value: Any):
        """Set value in cache with current timestamp"""
        self.cache[key] = (value, datetime.utcnow())
    
    @staticmethod
    def _interpret_weather_code(code: int) -> str:
        """Convert WMO weather code to human-readable description"""
        weather_descriptions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            56: "Light freezing drizzle",
            57: "Dense freezing drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            66: "Light freezing rain",
            67: "Heavy freezing rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail",
        }
        return weather_descriptions.get(code, "Unknown")
    
    async def search_location(self, query: str, count: int = 10) -> LocationSearchResponse:
        """Search for locations using Open-Meteo Geocoding API"""
        cache_key = f"geocoding:{query}:{count}"
        cached = self._get_cache(cache_key)
        if cached:
            return cached
        
        params = {
            "name": query,
            "count": count,
            "language": "en",
            "format": "json",
        }
        
        try:
            response = await self.client.get(settings.openmeteo_geocoding_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = []
            if "results" in data:
                for item in data["results"]:
                    results.append(LocationResult(
                        id=item.get("id"),
                        name=item.get("name"),
                        country=item.get("country", ""),
                        country_code=item.get("country_code", ""),
                        latitude=item.get("latitude"),
                        longitude=item.get("longitude"),
                        timezone=item.get("timezone", "UTC"),
                        population=item.get("population"),
                        admin1=item.get("admin1"),
                    ))
            
            result = LocationSearchResponse(results=results)
            self._set_cache(cache_key, result)
            return result
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch location data: {str(e)}")

    async def reverse_geocode(self, lat: float, lon: float) -> ReverseGeocodeResponse:
        """Get location name from coordinates using OpenStreetMap Nominatim"""
        cache_key = f"reverse:{lat}:{lon}"
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        # Use Nominatim for reverse geocoding
        url = "https://nominatim.openstreetmap.org/reverse"
        params = {
            "lat": lat,
            "lon": lon,
            "format": "json",
            "zoom": 10,  # City level
        }
        headers = {
            "User-Agent": "AdiyogiWeatherApp/1.0"
        }

        try:
            response = await self.client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()

            address = data.get("address", {})
            # Try to find the most relevant city name
            name = address.get("city") or address.get("town") or address.get("village") or address.get("county") or "Unknown Location"
            country = address.get("country", "")

            result = ReverseGeocodeResponse(
                name=name,
                city=name,
                country=country
            )
            
            self._set_cache(cache_key, result)
            return result

        except Exception as e:
            # Fallback if reverse geocoding fails
            print(f"Reverse geocoding failed: {e}")
            return ReverseGeocodeResponse(name=f"{lat:.2f}, {lon:.2f}", country="")
    
    async def get_current_weather(
        self, 
        lat: float, 
        lon: float, 
        units: str = "metric"
    ) -> CurrentWeatherResponse:
        """Get current weather for coordinates"""
        cache_key = f"current:{lat}:{lon}:{units}"
        cached = self._get_cache(cache_key)
        if cached:
            return cached
        
        temp_unit = "celsius" if units == "metric" else "fahrenheit"
        wind_unit = "kmh" if units == "metric" else "mph"
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ",".join([
                "temperature_2m",
                "apparent_temperature",
                "weather_code",
                "relative_humidity_2m",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "wind_gusts_10m",
                "cloud_cover",
                "precipitation",
            ]),
            "temperature_unit": temp_unit,
            "wind_speed_unit": wind_unit,
            "timezone": "auto",
        }
        
        try:
            response = await self.client.get(settings.openmeteo_forecast_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            current_data = data.get("current", {})
            
            current_weather = CurrentWeather(
                time=current_data.get("time", ""),
                temperature=current_data.get("temperature_2m", 0),
                apparent_temperature=current_data.get("apparent_temperature", 0),
                weather_code=current_data.get("weather_code", 0),
                weather_description=self._interpret_weather_code(current_data.get("weather_code", 0)),
                humidity=current_data.get("relative_humidity_2m", 0),
                pressure=current_data.get("surface_pressure", 0),
                wind_speed=current_data.get("wind_speed_10m", 0),
                wind_direction=current_data.get("wind_direction_10m", 0),
                wind_gusts=current_data.get("wind_gusts_10m", 0),
                cloud_cover=current_data.get("cloud_cover", 0),
                precipitation=current_data.get("precipitation", 0),
            )
            
            location_info = LocationInfo(
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                timezone=data.get("timezone", "UTC"),
                elevation=data.get("elevation"),
            )
            
            units_info = WeatherUnits(
                temperature="°C" if units == "metric" else "°F",
                wind_speed="km/h" if units == "metric" else "mph",
            )
            
            result = CurrentWeatherResponse(
                location=location_info,
                current=current_weather,
                units=units_info,
            )
            
            self._set_cache(cache_key, result)
            return result
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch current weather: {str(e)}")
    
    async def get_forecast(
        self,
        lat: float,
        lon: float,
        days: int = 7,
        units: str = "metric"
    ) -> ForecastResponse:
        """Get hourly and daily forecast"""
        # BUST CACHE: Added 'v2' to key
        cache_key = f"forecast:v2:{lat}:{lon}:{days}:{units}"
        cached = self._get_cache(cache_key)
        if cached:
            return cached
        
        temp_unit = "celsius" if units == "metric" else "fahrenheit"
        wind_unit = "kmh" if units == "metric" else "mph"
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ",".join([
                "temperature_2m",
                "apparent_temperature",
                "weather_code",
                "relative_humidity_2m",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "wind_gusts_10m",
                "cloud_cover",
                "precipitation",
            ]),
            "hourly": ",".join([
                "temperature_2m",
                "apparent_temperature",
                "weather_code",
                "precipitation_probability",
                "precipitation",
                "wind_speed_10m",
                "wind_direction_10m",
                "relative_humidity_2m",
                "cloud_cover",
            ]),
            "daily": ",".join([
                "temperature_2m_max",
                "temperature_2m_min",
                "weather_code",
                "precipitation_sum",
                "precipitation_probability_max",
                "sunrise",
                "sunset",
                "uv_index_max",
                "wind_speed_10m_max",
            ]),
            "temperature_unit": temp_unit,
            "wind_speed_unit": wind_unit,
            "timezone": "auto",
            "forecast_days": min(days, 16),  # Max 16 days
        }
        
        try:
            print(f"Fetching forecast for {lat}, {lon}")
            response = await self.client.get(settings.openmeteo_forecast_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # DEBUG LOGS
            print(f"API Response Keys: {data.keys()}")
            print(f"Current Keys: {data.get('current', {}).keys()}")
            print(f"Wind Speed 10m: {data.get('current', {}).get('wind_speed_10m')}")

            current_data = data.get("current", {})
            hourly_data = data.get("hourly", {})
            daily_data = data.get("daily", {})
            
            hourly_forecast = HourlyForecast(
                time=hourly_data.get("time", []),
                temperature=hourly_data.get("temperature_2m", []),
                apparent_temperature=hourly_data.get("apparent_temperature", []),
                weather_code=hourly_data.get("weather_code", []),
                precipitation_probability=hourly_data.get("precipitation_probability", []),
                precipitation=hourly_data.get("precipitation", []),
                wind_speed=hourly_data.get("wind_speed_10m", []),
                wind_direction=hourly_data.get("wind_direction_10m", []),
                humidity=hourly_data.get("relative_humidity_2m", []),
                cloud_cover=hourly_data.get("cloud_cover", []),
            )
            
            daily_forecast = DailyForecast(
                time=daily_data.get("time", []),
                temperature_max=daily_data.get("temperature_2m_max", []),
                temperature_min=daily_data.get("temperature_2m_min", []),
                weather_code=daily_data.get("weather_code", []),
                precipitation_sum=daily_data.get("precipitation_sum", []),
                precipitation_probability_max=daily_data.get("precipitation_probability_max", []),
                sunrise=daily_data.get("sunrise", []),
                sunset=daily_data.get("sunset", []),
                uv_index_max=daily_data.get("uv_index_max", []),
                wind_speed_max=daily_data.get("wind_speed_10m_max", []),
            )
            
            location_info = LocationInfo(
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                timezone=data.get("timezone", "UTC"),
                elevation=data.get("elevation"),
            )

            current_weather = None
            if current_data:
                # Use daily max UV as proxy since current UV is not available
                uv_proxy = 0
                if daily_data and "uv_index_max" in daily_data:
                    uv_list = daily_data.get("uv_index_max", [])
                    if uv_list:
                        uv_proxy = uv_list[0]

                current_weather = CurrentWeather(
                    time=current_data.get("time", ""),
                    temperature=current_data.get("temperature_2m", 0),
                    apparent_temperature=current_data.get("apparent_temperature", 0),
                    weather_code=current_data.get("weather_code", 0),
                    weather_description=self._interpret_weather_code(current_data.get("weather_code", 0)),
                    humidity=current_data.get("relative_humidity_2m", 0),
                    pressure=current_data.get("surface_pressure", 0),
                    wind_speed=current_data.get("wind_speed_10m", 0),
                    wind_direction=current_data.get("wind_direction_10m", 0),
                    wind_gusts=current_data.get("wind_gusts_10m", 0),
                    cloud_cover=current_data.get("cloud_cover", 0),
                    precipitation=current_data.get("precipitation", 0),
                    uv_index=uv_proxy,
                )
            
            units_info = WeatherUnits(
                temperature="°C" if units == "metric" else "°F",
                wind_speed="km/h" if units == "metric" else "mph",
            )
            
            result = ForecastResponse(
                location=location_info,
                current=current_weather,
                hourly=hourly_forecast,
                daily=daily_forecast,
                units=units_info,
            )
            
            self._set_cache(cache_key, result)
            return result
            
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch forecast: {str(e)}")


# Global service instance
weather_service = WeatherService()
