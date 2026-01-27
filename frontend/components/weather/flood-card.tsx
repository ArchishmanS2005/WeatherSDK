"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FloodData, getFloodForecast } from '@/lib/api';
import { AlertTriangle, Waves, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

interface FloodCardProps {
    lat: number;
    lon: number;
}

export default function FloodCard({ lat, lon }: FloodCardProps) {
    const [data, setData] = useState<FloodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const result = await getFloodForecast(lat, lon, 7);
                setData(result);
                setError(null);
            } catch (err) {
                setError('Failed to load flood forecast');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [lat, lon]);

    if (loading) {
        return (
            <Card className="w-full h-[400px]">
                <CardHeader>
                    <Skeleton className="h-8 w-64 mb-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    if (error || !data || !data.daily || !data.daily.river_discharge) {
        return (
            <Card className="w-full h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground flex flex-col items-center max-w-sm px-4">
                    <Waves className="h-10 w-10 mb-2 opacity-50" />
                    <p>{error || 'No river discharge data available for this location.'}</p>
                    <p className="text-xs mt-2 opacity-70">Flood data is typically available near major rivers and waterways.</p>
                </div>
            </Card>
        );
    }

    const chartData = data.daily.time.map((time, i) => ({
        time: format(parseISO(time), 'EEE, MMM d'),
        discharge: data.daily.river_discharge[i],
        mean: data.daily.river_discharge_mean ? data.daily.river_discharge_mean[i] : 0
    }));

    const riskLevel = data.flood_risk?.level || 'unknown';
    const riskColor = data.flood_risk?.color || '#gray';

    return (
        <div className="space-y-6">
            {/* Risk Banner */}
            <div className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: `${riskColor}15`, borderColor: `${riskColor}30` }}>
                <div className="p-2 rounded-full" style={{ backgroundColor: `${riskColor}30`, color: riskColor }}>
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg capitalize" style={{ color: riskColor }}>
                        {riskLevel} Flood Risk
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {data.flood_risk?.description}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Max Discharge</div>
                    <div className="text-xl font-bold">{data.statistics?.max || 0}</div>
                    <div className="text-xs opacity-70">m³/s</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Avg Discharge</div>
                    <div className="text-xl font-bold">{data.statistics?.mean || 0}</div>
                    <div className="text-xs opacity-70">m³/s</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Median</div>
                    <div className="text-xl font-bold">{data.statistics?.median || 0}</div>
                    <div className="text-xs opacity-70">m³/s</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Trend</div>
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                        {(data.statistics?.max ?? 0) > (data.statistics?.mean ?? 0) * 1.5 ? 'Rising' : 'Stable'}
                    </div>
                </div>
            </div>

            {/* Discharge Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>River Discharge Forecast</CardTitle>
                    <CardDescription>Predicted water flow volume for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorDischarge" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#50f0e6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#50f0e6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                unit=" m³/s"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="discharge"
                                stroke="#50f0e6"
                                fillOpacity={1}
                                fill="url(#colorDischarge)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground">
                Data provided by Global Flood Awareness System (GloFAS)
            </div>
        </div>
    );
}
