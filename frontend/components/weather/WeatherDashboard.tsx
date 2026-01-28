"use client";

import { MainWeatherCard } from "./MainWeatherCard";
import { HighlightGrid } from "./HighlightsGrid";
import { ForecastList } from "./ForecastList";
import { useEffect, useState } from "react";
import { useWeatherTheme } from "@/context/WeatherThemeContext";
import { useLocation } from "@/context/LocationContext";
import { getForecast } from "@/lib/api";

interface WeatherDashboardProps {
    data: any;
}

export function WeatherDashboard({ data }: WeatherDashboardProps) {
    const { setCondition } = useWeatherTheme();
    const { lat, lon, city } = useLocation(); // Get global location
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch forecast based on global context (lat, lon)
                const res = await getForecast(lat, lon, 7);
                setWeather(res);

                // Update Theme
                if (res.current) {
                    const code = res.current.weather_code;
                    // Simple mapping logic based on WMO codes
                    if (code === 0 || code === 1) setCondition("Clear");
                    else if (code <= 3) setCondition("Clouds");
                    else if (code >= 95) setCondition("Storm");
                    else if (code >= 51 && code <= 67) setCondition("Rain");
                    else setCondition("Default");
                }
            } catch (e) {
                console.error("Failed to fetch weather", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lat, lon, setCondition]); // Refetch when lat/lon changes

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] flex-col gap-4">
                <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-zinc-400 animate-pulse">Loading Nano Atmosphere...</p>
            </div>
        );
    }

    if (!weather) return <div className="text-white text-center">Failed to load data</div>;

    // Transform Hourly Data for Chart
    const hourlyData = weather.hourly?.time.map((t: string, i: number) => ({
        time: new Date(t).getTime(),
        temp_c: weather.hourly?.temperature[i]
    })).slice(0, 24) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-white font-outfit">Overview</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'today'
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setActiveTab('week')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'week'
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                    >
                        Next 7 Days
                    </button>
                </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'today' ? (
                <div className="space-y-6">
                    {/* Top Grid: Main Card (Left) + Highlights (Right) */}
                    <div className="grid grid-cols-12 gap-6 h-auto">
                        <MainWeatherCard weather={weather} city={city} />
                        <HighlightGrid weather={weather} hourly={hourlyData} />
                    </div>
                </div>
            ) : (
                /* Week View */
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4 font-outfit">7-Day Forecast</h2>
                    <ForecastList daily={weather.daily} />
                </div>
            )}
        </div>
    );
}
