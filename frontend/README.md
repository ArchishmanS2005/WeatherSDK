# Weather Frontend

A sophisticated, minimalist weather application built with Next.js, featuring a beautiful black and white design with smooth animations.

## Features

- 🎨 Sophisticated black & white design system
- ✨ Smooth scroll animations with Framer Motion
- 🔍 Real-time location search
- 🌡️ Current weather conditions
- 📅 7-day weather forecast
- 📱 Fully responsive design
- ⚡ Fast and optimized

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & design system
├── components/
│   ├── animations/
│   │   └── scroll-reveal.tsx
│   └── weather/
│       ├── weather-hero.tsx
│       ├── current-weather-card.tsx
│       └── forecast-cards.tsx
├── lib/
│   └── api.ts              # API client
└── public/
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL`

### Render

1. Create a new Static Site
2. Connect your repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL`

## Design System

The application uses a sophisticated black and white color palette:

- **Light Mode**: Pure white backgrounds with black text
- **Dark Mode**: Pure black backgrounds with white text
- **Accents**: Subtle grays for depth and hierarchy
- **Typography**: Inter font family for clean, modern look
- **Animations**: Smooth scroll reveals and micro-interactions

## License

MIT
