"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Droplets, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ComposedChart } from "recharts";
import type { HistoricalData } from "@/lib/api";

interface HistoricalChartProps {
    data: HistoricalData;
    locationName: string;
}

export function HistoricalChart({ data, locationName }: HistoricalChartProps) {
    if (!data?.daily) {
        return null;
    }

    const { daily } = data;

    // Prepare temperature chart data
    const tempChartData = daily.time.map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Max Temp': daily.temperature_2m_max[i],
        'Min Temp': daily.temperature_2m_min[i],
        'Avg Temp': daily.temperature_2m_mean[i],
    }));

    // Prepare precipitation chart data
    const precipChartData = daily.time.map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Precipitation': daily.precipitation_sum[i],
    }));

    // Calculate statistics
    const stats = {
        maxTemp: Math.max(...daily.temperature_2m_max),
        minTemp: Math.min(...daily.temperature_2m_min),
        avgTemp: daily.temperature_2m_mean.reduce((a, b) => a + b, 0) / daily.temperature_2m_mean.length,
        totalPrecip: daily.precipitation_sum.reduce((a, b) => a + b, 0),
        rainyDays: daily.precipitation_sum.filter(p => p > 0.1).length,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-muted-foreground">Highest</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.maxTemp.toFixed(1)}°</div>
                    <div className="text-xs text-muted-foreground">Maximum temperature</div>
                </div>

                <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-muted-foreground">Lowest</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.minTemp.toFixed(1)}°</div>
                    <div className="text-xs text-muted-foreground">Minimum temperature</div>
                </div>

                <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-muted-foreground">Precipitation</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.totalPrecip.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">mm total</div>
                </div>

                <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-muted-foreground">Rainy Days</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.rainyDays}</div>
                    <div className="text-xs text-muted-foreground">days with rain</div>
                </div>
            </div>

            {/* Temperature Trend Chart */}
            <div className="bg-white dark:bg-black border-2 border-border rounded-3xl p-6">
                <h3 className="text-2xl font-bold mb-4">Temperature Trends</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={tempChartData}>
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis stroke="#666" tick={{ fontSize: 12 }} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
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
                            dataKey="Max Temp"
                            fill="url(#tempGradient)"
                            stroke="none"
                        />
                        <Line
                            type="monotone"
                            dataKey="Max Temp"
                            stroke="#ff6b6b"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="Avg Temp"
                            stroke="#f9ca24"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="Min Temp"
                            stroke="#4ecdc4"
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Precipitation Chart */}
            <div className="bg-white dark:bg-black border-2 border-border rounded-3xl p-6">
                <h3 className="text-2xl font-bold mb-4">Precipitation History</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={precipChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis stroke="#666" tick={{ fontSize: 12 }} label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#000',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="Precipitation"
                            fill="#4ecdc4"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Data Summary */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-950 border-2 border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-3">Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-2 font-semibold">{locationName}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Data Points:</span>
                        <span className="ml-2 font-semibold">{daily.time.length} days</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Average Temperature:</span>
                        <span className="ml-2 font-semibold">{stats.avgTemp.toFixed(1)}°C</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Temperature Range:</span>
                        <span className="ml-2 font-semibold">
                            {stats.minTemp.toFixed(1)}° to {stats.maxTemp.toFixed(1)}°C
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
