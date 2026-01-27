# Weather API Backend

A FastAPI-based backend for weather data using the Open-Meteo API.

## Features

- 🌤️ Current weather conditions
- 📅 7-16 day weather forecast
- 🔍 Location search with geocoding
- ⚡ Fast response times with caching
- 🌍 No API key required (uses Open-Meteo)
- 📊 Comprehensive weather metrics

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Open-Meteo API** - Free weather data API
- **Pydantic** - Data validation
- **httpx** - Async HTTP client

## Setup

### Prerequisites

- Python 3.11 or higher
- pip

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file (optional):
```bash
cp .env.example .env
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Health check

### Location Search
- `GET /api/geocoding/search?query={city}&count={number}`
  - Search for locations
  - Returns coordinates, timezone, and location info

### Current Weather
- `GET /api/weather/current?lat={lat}&lon={lon}&units={metric|imperial}`
  - Get current weather conditions
  - Returns temperature, humidity, wind, pressure, etc.

### Weather Forecast
- `GET /api/weather/forecast?lat={lat}&lon={lon}&days={1-16}&units={metric|imperial}`
  - Get hourly and daily forecast
  - Up to 16 days of forecast data

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Deployment

### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables if needed

### Docker

```bash
docker build -t weather-api .
docker run -p 8000:8000 weather-api
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGINS` | localhost:3000 | Allowed CORS origins |
| `CACHE_TTL_SECONDS` | 300 | Cache time-to-live |
| `API_TIMEOUT_SECONDS` | 10 | API request timeout |

## License

MIT
