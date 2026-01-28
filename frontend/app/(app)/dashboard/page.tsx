"use client";

import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

// Mock Data (In a real app, this would come from API or Context)
const mockWeather = {
    current: {
        temp_c: 24,
        condition: { text: "Partly Cloudy", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" },
        wind_kph: 12,
        humidity: 65,
        uv: 4,
        vis_km: 10,
        pressure_mb: 1012,
    },
    location: {
        name: "San Francisco",
        region: "California",
        country: "USA",
        localtime: "2024-03-20 14:30",
    },
    forecast: {
        forecastday: [],
    },
};

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-black/95 text-white">
            <WeatherDashboard data={mockWeather} />
        </main>
    );
}
