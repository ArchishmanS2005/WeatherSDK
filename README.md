# Weather Application

A sophisticated, open-source weather application with a beautiful black and white design. Features real-time weather data, 7-day forecasts, and smooth animations.

## 🌟 Features

- **Beautiful Design**: Sophisticated black & white aesthetic with smooth animations
- **Real-time Data**: Current weather conditions and forecasts powered by Open-Meteo API
- **No API Key Required**: Uses free, open-source Open-Meteo API
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast & Modern**: Built with Next.js and FastAPI for optimal performance

## 🏗️ Architecture

### Backend (FastAPI + Python)
- RESTful API with FastAPI
- Open-Meteo API integration
- Response caching for performance
- Comprehensive error handling
- CORS enabled for frontend communication

### Frontend (Next.js + TypeScript)
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design

## 🚀 Quick Start

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

## 📦 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables if needed
5. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Import project in Vercel or Netlify
3. Set **Root Directory**: `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
5. Deploy!

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- Python 3.11+
- httpx (async HTTP client)
- Pydantic (data validation)
- Open-Meteo API

**Frontend:**
- Next.js 14+
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `GET /api/geocoding/search?query={city}` - Search locations
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/forecast?lat={lat}&lon={lon}&days={days}` - Weather forecast

## 🎨 Design Philosophy

The application embraces a minimalist black and white aesthetic:
- Clean, uncluttered interfaces
- Smooth, purposeful animations
- Clear typography hierarchy
- Responsive and accessible

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Built with ❤️ using modern web technologies
