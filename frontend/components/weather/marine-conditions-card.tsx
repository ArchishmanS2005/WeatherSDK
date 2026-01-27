"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Waves, Navigation, TrendingUp, Droplets } from "lucide-react";
import { getCurrentMarineConditions, getMarineForecast, type MarineData } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

interface MarineConditionsCardProps {
    latitude: number;
    longitude: number;
    locationName: string;
}

export function MarineConditionsCard({ latitude, longitude, locationName }: MarineConditionsCardProps) {
    const [current, setCurrent] = useState<MarineData | null>(null);
    const [forecast, setForecast] = useState<MarineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMarineData();
    }, [latitude, longitude]);

    const loadMarineData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [currentData, forecastData] = await Promise.all([
                getCurrentMarineConditions(latitude, longitude),
                getMarineForecast(latitude, longitude, 3)
            ]);

            setCurrent(currentData);
            setForecast(forecastData);
        } catch (err) {
            setError("Failed to load marine data");
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
                <p className="text-muted-foreground text-center">
                    Marine data not available for this location
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                    This feature is only available for coastal and ocean locations
                </p>
            </div>
        );
    }

    const { current: currentConditions, wave_conditions } = current;

    // Prepare chart data
    const chartData = forecast?.hourly ? forecast.hourly.time.slice(0, 48).map((time, i) => ({
        time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', day: 'numeric' }),
        'Wave Height': forecast.hourly!.wave_height[i],
        'Wave Period': forecast.hourly!.wave_period[i],
    })) : [];

    const metrics = [
        {
            name: "Wave Height",
            value: currentConditions.wave_height,
            unit: "m",
            icon: Waves,
            color: "#4ecdc4"
        },
        {
            name: "Wave Period",
            value: currentConditions.wave_period,
            unit: "s",
            icon: TrendingUp,
            color: "#95afc0"
        },
        {
            name: "Wave Direction",
            value: currentConditions.wave_direction,
            unit: "°",
            icon: Navigation,
            color: "#f9ca24"
        },
        {
            name: "Swell Height",
            value: currentConditions.swell_wave_height,
            unit: "m",
            icon: Droplets,
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
                <h2 className="text-3xl font-bold mb-2">Marine Conditions</h2>
                <p className="text-muted-foreground">{locationName}</p>
            </div>

            {/* Wave Conditions Banner */}
            {wave_conditions && (
                <div
                    className="mb-6 p-4 rounded-xl border-2"
                    style={{
                        borderColor: wave_conditions.color,
                        backgroundColor: `${wave_conditions.color}10`
                    }}
                >
                    <div className="flex items-center gap-3">
                        <Waves className="w-6 h-6" style={{ color: wave_conditions.color }} />
                        <div>
                            <div className="font-bold" style={{ color: wave_conditions.color }}>
                                {wave_conditions.condition}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {wave_conditions.description}
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
                                {metric.value ? metric.value.toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">{metric.unit}</div>
                        </div>
                    );
                })}
            </div>

            {/* 48-Hour Wave Forecast */}
            {chartData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">48-Hour Wave Forecast</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} />
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
                                dataKey="Wave Height"
                                stroke="#4ecdc4"
                                fillOpacity={1}
                                fill="url(#waveGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="Wave Period"
                                stroke="#95afc0"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Ocean Currents */}
            <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-bold mb-3">Ocean Currents</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Velocity:</span>
                        <span className="ml-2 font-semibold">
                            {currentConditions.ocean_current_velocity?.toFixed(2) || 'N/A'} m/s
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Direction:</span>
                        <span className="ml-2 font-semibold">
                            {currentConditions.ocean_current_direction?.toFixed(0) || 'N/A'}°
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
