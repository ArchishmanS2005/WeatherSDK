"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Zap, TrendingUp, Clock } from "lucide-react";
import { getCurrentSolarData, getSolarForecast, type SolarData } from "@/lib/api";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SolarRadiationCardProps {
    latitude: number;
    longitude: number;
    locationName: string;
}

export function SolarRadiationCard({ latitude, longitude, locationName }: SolarRadiationCardProps) {
    const [current, setCurrent] = useState<SolarData | null>(null);
    const [forecast, setForecast] = useState<SolarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSolarData();
    }, [latitude, longitude]);

    const loadSolarData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [currentData, forecastData] = await Promise.all([
                getCurrentSolarData(latitude, longitude),
                getSolarForecast(latitude, longitude, 3)
            ]);

            setCurrent(currentData);
            setForecast(forecastData);
        } catch (err) {
            setError("Failed to load solar data");
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

    if (error || !current?.current) {
        return (
            <div className="bg-white dark:bg-black border-2 border-border rounded-3xl p-8">
                <p className="text-red-500">{error || "No solar data available"}</p>
            </div>
        );
    }

    const { current: currentData, solar_potential, best_solar_hours } = current;

    // Prepare chart data
    const chartData = forecast?.hourly ? forecast.hourly.time.slice(0, 48).map((time, i) => ({
        time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', day: 'numeric' }),
        'Solar Radiation': forecast.hourly!.shortwave_radiation[i],
        'Direct Radiation': forecast.hourly!.direct_radiation[i],
    })) : [];

    const metrics = [
        {
            name: "Solar Radiation",
            value: currentData.shortwave_radiation,
            unit: "W/m²",
            icon: Sun,
            color: "#f9ca24"
        },
        {
            name: "Direct Radiation",
            value: currentData.direct_radiation,
            unit: "W/m²",
            icon: Zap,
            color: "#ff6b6b"
        },
        {
            name: "Diffuse Radiation",
            value: currentData.diffuse_radiation,
            unit: "W/m²",
            icon: TrendingUp,
            color: "#4ecdc4"
        },
        {
            name: "DNI",
            value: currentData.direct_normal_irradiance,
            unit: "W/m²",
            icon: Clock,
            color: "#6c5ce7"
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-950 border-2 border-border rounded-3xl p-8 shadow-2xl"
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Solar Radiation</h2>
                <p className="text-muted-foreground">{locationName}</p>
            </div>

            {/* Solar Potential Banner */}
            {solar_potential && (
                <div
                    className="mb-6 p-4 rounded-xl border-2"
                    style={{
                        borderColor: solar_potential.color,
                        backgroundColor: `${solar_potential.color}10`
                    }}
                >
                    <div className="flex items-center gap-3">
                        <Sun className="w-6 h-6" style={{ color: solar_potential.color }} />
                        <div>
                            <div className="font-bold" style={{ color: solar_potential.color }}>
                                {solar_potential.rating} Solar Potential
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {solar_potential.description} • {solar_potential.efficiency} efficiency
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={metric.name}
                            className="bg-white dark:bg-black border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4" style={{ color: metric.color }} />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {metric.name}
                                </span>
                            </div>
                            <div className="text-2xl font-bold">
                                {metric.value ? Math.round(metric.value) : 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">{metric.unit}</div>
                        </div>
                    );
                })}
            </div>

            {/* 48-Hour Solar Forecast */}
            {chartData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">48-Hour Solar Forecast</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f9ca24" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f9ca24" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                            <Area
                                type="monotone"
                                dataKey="Solar Radiation"
                                stroke="#f9ca24"
                                fillOpacity={1}
                                fill="url(#solarGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="Direct Radiation"
                                stroke="#ff6b6b"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Best Solar Hours */}
            {best_solar_hours && best_solar_hours.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-bold mb-3">Best Solar Hours (Top 5)</h3>
                    <div className="space-y-2">
                        {best_solar_hours.slice(0, 5).map((hour, i) => (
                            <div key={i} className="flex items-center justify-between text-sm bg-white dark:bg-black border border-border rounded-lg p-3">
                                <span className="font-medium">
                                    {new Date(hour.time).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric'
                                    })}
                                </span>
                                <span className="text-muted-foreground">
                                    {Math.round(hour.radiation)} W/m²
                                </span>
                                <span
                                    className="text-xs font-semibold px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: `${hour.potential.color}20`,
                                        color: hour.potential.color
                                    }}
                                >
                                    {hour.potential.rating}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
