"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Eye, AlertCircle } from "lucide-react";
import { getCurrentAirQuality, getAirQualityForecast, type AirQualityData, getAQIColor } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AirQualityCardProps {
    latitude: number;
    longitude: number;
    locationName: string;
}

export function AirQualityCard({ latitude, longitude, locationName }: AirQualityCardProps) {
    const [currentAQI, setCurrentAQI] = useState<AirQualityData | null>(null);
    const [forecast, setForecast] = useState<AirQualityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAirQualityData();
    }, [latitude, longitude]);

    const loadAirQualityData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [current, forecastData] = await Promise.all([
                getCurrentAirQuality(latitude, longitude),
                getAirQualityForecast(latitude, longitude, 3)
            ]);

            setCurrentAQI(current);
            setForecast(forecastData);
        } catch (err) {
            setError("Failed to load air quality data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-black border-2 border-border rounded-3xl p-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        );
    }

    if (error || !currentAQI?.current) {
        return (
            <div className="bg-white dark:bg-black border-2 border-border rounded-3xl p-8">
                <p className="text-red-500">{error || "No air quality data available"}</p>
            </div>
        );
    }

    const { current, european_aqi_category, us_aqi_category } = currentAQI;
    const primaryAQI = current.european_aqi;
    const category = european_aqi_category;

    // Prepare chart data
    const chartData = forecast?.hourly ? forecast.hourly.time.slice(0, 24).map((time, i) => ({
        time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
        'EU AQI': forecast.hourly!.european_aqi[i],
        'US AQI': forecast.hourly!.us_aqi[i],
        'PM2.5': forecast.hourly!.pm2_5[i],
        'PM10': forecast.hourly!.pm10[i],
    })) : [];

    const pollutants = [
        { name: "PM2.5", value: current.pm2_5, unit: "μg/m³", icon: Droplets, color: "#ff6b6b" },
        { name: "PM10", value: current.pm10, unit: "μg/m³", icon: Wind, color: "#4ecdc4" },
        { name: "NO₂", value: current.nitrogen_dioxide, unit: "μg/m³", icon: AlertCircle, color: "#f9ca24" },
        { name: "O₃", value: current.ozone, unit: "μg/m³", icon: Eye, color: "#95afc0" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-950 border-2 border-border rounded-3xl p-8 shadow-2xl"
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Air Quality</h2>
                <p className="text-muted-foreground">{locationName}</p>
            </div>

            {/* AQI Gauge */}
            <div className="mb-8 text-center">
                <div className="relative inline-block">
                    <svg width="200" height="120" viewBox="0 0 200 120">
                        {/* Background arc */}
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#e5e5e5"
                            strokeWidth="20"
                            strokeLinecap="round"
                        />
                        {/* Colored arc */}
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={category?.color || '#50f0e6'}
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${(primaryAQI / 100) * 251} 251`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                        <div className="text-5xl font-black">{Math.round(primaryAQI)}</div>
                        <div className="text-sm font-medium" style={{ color: category?.color }}>
                            {category?.category}
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
                    {category?.recommendation}
                </p>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {pollutants.map((pollutant) => {
                    const Icon = pollutant.icon;
                    return (
                        <div
                            key={pollutant.name}
                            className="bg-white dark:bg-black border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4" style={{ color: pollutant.color }} />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {pollutant.name}
                                </span>
                            </div>
                            <div className="text-2xl font-bold">{pollutant.value.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                        </div>
                    );
                })}
            </div>

            {/* 24-Hour Forecast Chart */}
            {chartData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">24-Hour Forecast</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                            <XAxis
                                dataKey="time"
                                stroke="#666"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="EU AQI"
                                stroke="#50f0e6"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="PM2.5"
                                stroke="#ff6b6b"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">UV Index:</span>
                        <span className="ml-2 font-semibold">{current.uv_index.toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Dust:</span>
                        <span className="ml-2 font-semibold">{current.dust.toFixed(1)} μg/m³</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
