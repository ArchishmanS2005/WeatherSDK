# Adiyogi Weather Platform

A sophisticated, enterprise-grade weather application with beautiful UI design. Features real-time weather data, 7-day forecasts, historical analysis, and advanced climate predictions.

## 🌟 Features

- **Beautiful Design**: Premium dark theme with smooth animations
- **Real-time Data**: Current weather conditions and forecasts
- **Advanced Analytics**: Historical data and climate predictions
- **Global Coverage**: Weather data from anywhere on Earth
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast & Modern**: Built with Next.js 14 and TypeScript

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design
- Client-side data fetching

### Backend (FastAPI + Python)
- RESTful API with FastAPI
- Weather data aggregation
- Response caching for performance
- Comprehensive error handling
- CORS enabled for frontend communication

### SDKs
- **TypeScript/JavaScript SDK** - For web and Node.js applications
- **Python SDK** - For data science and backend integration

## 🚀 Quick Start

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

## 📦 SDKs

### TypeScript/JavaScript SDK

Install:
```bash
npm install @adiyogi/weather-sdk
```

Usage:
```typescript
import { AdiyogiClient } from '@adiyogi/weather-sdk';

const client = new AdiyogiClient();
const weather = await client.weather.getCurrent({
  lat: 40.7128,
  lon: -74.0060
});
```

See [SDK Documentation](./sdk/typescript/README.md) for full details.

### Python SDK

Install:
```bash
pip install adiyogi-weather
```

Usage:
```python
from adiyogi_weather import Adiyogi

async with Adiyogi() as client:
    weather = await client.weather.get_current(
        lat=40.7128,
        lon=-74.0060
    )
```

See [SDK Documentation](./sdk/python/README.md) for full details.

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `GET /api/geocoding/search?query={city}` - Search locations
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/forecast?lat={lat}&lon={lon}&days={days}` - Weather forecast
- `GET /api/weather/historical` - Historical weather data
- `GET /api/weather/elevation` - Elevation data

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

**Backend:**
- FastAPI
- Python 3.11+
- httpx (async HTTP client)
- Pydantic (data validation)

**SDKs:**
- TypeScript/JavaScript (npm)
- Python (PyPI)

## 🎨 Design Philosophy

The application embraces a premium dark aesthetic:
- Clean, uncluttered interfaces
- Smooth, purposeful animations
- Clear typography hierarchy
- Responsive and accessible
- Premium glassmorphism effects

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set **Root Directory**: `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy!

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Deploy!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Built with ❤️ using modern web technologies and best practices.

