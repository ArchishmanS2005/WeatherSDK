"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ClimateData, getClimateProjections } from '@/lib/api';
import { CheckCircle2, AlertTriangle, CloudRain, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';

interface ClimateCardProps {
    lat: number;
    lon: number;
}

export default function ClimateCard({ lat, lon }: ClimateCardProps) {
    const [data, setData] = useState<ClimateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch 25-year projection
                const startDate = '2025-01-01';
                const endDate = '2050-12-31';
                const result = await getClimateProjections(lat, lon, startDate, endDate);
                setData(result);
                setError(null);
            } catch (err) {
                setError('Failed to load climate projections');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [lat, lon]);

    if (loading) {
        return (
            <Card className="w-full h-[500px]">
                <CardHeader>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    if (error || !data || !data.daily || !data.summary) {
        return (
            <Card className="w-full h-[500px] flex items-center justify-center">
                <div className="text-center text-red-500 flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p>{error || 'Climate data unavailable'}</p>
                </div>
            </Card>
        );
    }

    // Process data for chart (simplify to yearly averages for readability)
    const chartData: { year: string; temp: number }[] = [];
    const yearlyTemps: { [key: string]: number[] } = {};

    data.daily.time.forEach((date, i) => {
        const year = date.substring(0, 4);
        if (!yearlyTemps[year]) yearlyTemps[year] = [];
        yearlyTemps[year].push(data.daily.temperature_2m_mean[i]);
    });

    Object.keys(yearlyTemps).sort().forEach(year => {
        const temps = yearlyTemps[year];
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        chartData.push({
            year,
            temp: parseFloat(avg.toFixed(1))
        });
    });

    const isWarming = data.summary.temperature.trend === 'warming';

    return (
        <div className="space-y-6">
            {/* Climate Summary Banner */}
            <div className={`p-4 rounded-xl border ${isWarming ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} flex items-start gap-4`}>
                <div className={`p-2 rounded-full ${isWarming ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    <Thermometer className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">
                        Long-term Climate Projection (2025-2050)
                    </h3>
                    <p className="text-muted-foreground mt-1">
                        Analysis indicates a <span className={`font-medium ${isWarming ? 'text-red-500' : 'text-blue-500'}`}>{data.summary.temperature.projected_change > 0 ? '+' : ''}{data.summary.temperature.projected_change}°C</span> change in average temperatures over the next 25 years based on CMIP6 models.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Temperature</CardDescription>
                        <CardTitle className="text-2xl">{data.summary.temperature.average}°C</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Min: {data.summary.temperature.minimum}°C</span>
                            <span>Max: {data.summary.temperature.maximum}°C</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Precipitation</CardDescription>
                        <CardTitle className="text-2xl">{data.summary.precipitation.total} mm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><CloudRain className="h-3 w-3" /> Annual Avg</span>
                            <span>{(data.summary.precipitation.total / 25).toFixed(1)} mm/yr</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Projection Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Temperature Projection Trend</CardTitle>
                    <CardDescription>Projected mean annual temperature (2025-2050)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                interval={4}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                unit="°C"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke={isWarming ? "#ff5050" : "#50f0e6"}
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground">
                Data provided by Adiyogi Climate API (Advanced Climate Models)
            </div>
        </div>
    );
}
