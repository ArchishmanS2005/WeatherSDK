# Adiyogi Weather SDK (Python)

[![PyPI version](https://img.shields.io/pypi/v/adiyogi-weather.svg)](https://pypi.org/project/adiyogi-weather/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/pypi/pyversions/adiyogi-weather.svg)](https://pypi.org/project/adiyogi-weather/)

A comprehensive Python SDK for accessing high-precision weather, climate, and environmental data with async/await support and full type hints.

## 📦 Installation

```bash
pip install adiyogi-weather
```

## 🚀 Quick Start

```python
from adiyogi_weather import Adiyogi
import asyncio

async def main():
    async with Adiyogi() as client:
        # Get current weather
        weather = await client.weather.get_current(
            lat=40.7128,
            lon=-74.0060
        )
        
        print(f"Temperature: {weather.temperature}°C")
        print(f"Condition: {weather.condition}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 🌟 Features

- ✅ **Fully Typed** - Complete type hints with Pydantic models
- ✅ **Async/Await** - Built on asyncio and httpx
- ✅ **Type Safe** - Pydantic validation for all responses
- ✅ **Zero Config** - Works out of the box
- ✅ **Error Handling** - Comprehensive exception types
- ✅ **Python 3.8+** - Modern Python support

## 📚 Services

### Weather Forecast

```python
async with Adiyogi() as client:
    # Get 7-day forecast
    forecast = await client.weather.get_forecast(
        lat=52.52,
        lon=13.41,
        days=7
    )
    
    for day in forecast.daily:
        print(f"{day.date}: {day.temperature.max}°C")
```

### Historical Data

```python
from datetime import datetime, timedelta

async with Adiyogi() as client:
    # Get historical weather
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    historical = await client.historical.get_range(
        lat=52.52,
        lon=13.41,
        start_date=start_date,
        end_date=end_date
    )
    
    print(f"Average temp: {historical.avg_temperature}°C")
```

### Air Quality

```python
async with Adiyogi() as client:
    # Get current air quality
    air_quality = await client.air_quality.get_current(
        lat=28.61,
        lon=77.20
    )
    
    print(f"AQI: {air_quality.aqi}")
    print(f"PM2.5: {air_quality.pm25}")
```

### Marine Data

```python
async with Adiyogi() as client:
    # Get marine forecast
    marine = await client.marine.get_forecast(
        lat=35.6762,
        lon=139.6503,
        days=3
    )
    
    print(f"Wave height: {marine.wave_height}m")
```

### Elevation

```python
async with Adiyogi() as client:
    # Get elevation
    elevation = await client.elevation.get_elevation(
        lat=47.5162,
        lon=14.5501
    )
    
    print(f"Elevation: {elevation.altitude}m")
```

### Geocoding

```python
async with Adiyogi() as client:
    # Search for locations
    results = await client.geocoding.search(query="London")
    
    for location in results:
        print(f"{location.name}, {location.country}")
```

## 🔧 Advanced Configuration

```python
from adiyogi_weather import Adiyogi, AdiyogiConfig

config = AdiyogiConfig(
    api_key="your-api-key",
    base_url="https://api.adiyogi.com",
    timeout=10.0,
    max_retries=3,
    cache_enabled=True
)

async with Adiyogi(config=config) as client:
    weather = await client.weather.get_current(lat=40.7, lon=-74)
```

## 📖 API Reference

### Client Methods

- `client.weather.get_current(lat, lon)` - Current weather
- `client.weather.get_forecast(lat, lon, days)` - Weather forecast
- `client.historical.get_range(lat, lon, start_date, end_date)` - Historical data
- `client.air_quality.get_current(lat, lon)` - Air quality
- `client.marine.get_forecast(lat, lon, days)` - Marine forecast
- `client.elevation.get_elevation(lat, lon)` - Elevation data
- `client.geocoding.search(query)` - Location search
- `client.climate.get_projections(lat, lon)` - Climate projections
- `client.solar.get_radiation(lat, lon)` - Solar radiation

### Pydantic Models

```python
from adiyogi_weather.models import (
    WeatherResponse,
    ForecastResponse,
    HistoricalResponse,
    AirQualityResponse
)

# All responses are validated Pydantic models
weather: WeatherResponse = await client.weather.get_current(lat=40.7, lon=-74)
```

## ⚠️ Error Handling

```python
from adiyogi_weather.exceptions import (
    NetworkError,
    ValidationError,
    APIError
)

try:
    async with Adiyogi() as client:
        weather = await client.weather.get_current(lat=40.7, lon=-74)
except NetworkError as e:
    print(f"Network issue: {e}")
except ValidationError as e:
    print(f"Invalid parameters: {e}")
except APIError as e:
    print(f"API error: {e}")
```

## 🔄 Synchronous Usage

For non-async environments:

```python
from adiyogi_weather import AdiyogiSync

client = AdiyogiSync()
weather = client.weather.get_current(lat=40.7128, lon=-74.0060)
print(f"Temperature: {weather.temperature}°C")
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=adiyogi_weather
```

## 📝 Type Checking

```bash
# Run mypy
mypy adiyogi_weather
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 🔗 Links

- [Documentation](https://docs.adiyogi.com)
- [GitHub](https://github.com/adiyogi/adiyogi-weather)
- [PyPI](https://pypi.org/project/adiyogi-weather/)
- [Issues](https://github.com/adiyogi/adiyogi-weather/issues)

## 📞 Support

For support, email support@adiyogi.com or open an issue on GitHub.

## 🌍 Examples

### Weather Dashboard

```python
import asyncio
from adiyogi_weather import Adiyogi

async def weather_dashboard(cities):
    async with Adiyogi() as client:
        tasks = [
            client.weather.get_current(lat=lat, lon=lon)
            for lat, lon in cities
        ]
        results = await asyncio.gather(*tasks)
        
        for city, weather in zip(cities, results):
            print(f"{city}: {weather.temperature}°C - {weather.condition}")

cities = [(40.7128, -74.0060), (51.5074, -0.1278), (35.6762, 139.6503)]
asyncio.run(weather_dashboard(cities))
```

### Historical Analysis

```python
from adiyogi_weather import Adiyogi
from datetime import datetime, timedelta
import pandas as pd

async def analyze_temperature_trend():
    async with Adiyogi() as client:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        data = await client.historical.get_range(
            lat=40.7128,
            lon=-74.0060,
            start_date=start_date,
            end_date=end_date
        )
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(data.daily)
        print(f"Average temperature: {df['temperature'].mean():.1f}°C")
        print(f"Max temperature: {df['temperature'].max():.1f}°C")
        print(f"Min temperature: {df['temperature'].min():.1f}°C")

asyncio.run(analyze_temperature_trend())
```

