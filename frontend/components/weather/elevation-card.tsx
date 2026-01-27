"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ElevationData, getElevation } from '@/lib/api';
import { Mountain, Map, ArrowUp } from 'lucide-react';

interface ElevationCardProps {
    lat: number;
    lon: number;
}

export default function ElevationCard({ lat, lon }: ElevationCardProps) {
    const [data, setData] = useState<ElevationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const result = await getElevation(lat, lon);
                setData(result);
                setError(null);
            } catch (err) {
                setError('Failed to load elevation data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [lat, lon]);

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-8 w-48 mb-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    if (error || !data) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div className="text-center text-red-500">
                        {error || 'Elevation data unavailable'}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const terrainColor = data.terrain_type?.color || '#95afc0';

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Mountain className="h-5 w-5" />
                            Elevation & Terrain
                        </CardTitle>
                        <CardDescription>Topographical data for this location</CardDescription>
                    </div>
                    <div
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                            color: terrainColor,
                            borderColor: `${terrainColor}40`,
                            backgroundColor: `${terrainColor}10`
                        }}
                    >
                        {data.terrain_type?.type}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Visual Representation */}
                    <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-b from-blue-400/10 to-emerald-900/10 border flex items-end justify-center pb-0">
                        {/* Dynamic mountains SVG based on elevation */}
                        <svg viewBox="0 0 100 50" className="w-full h-full absolute bottom-0">
                            {/* Background mountains */}
                            <path
                                d="M0,50 L20,30 L40,45 L60,20 L80,40 L100,50 Z"
                                fill={terrainColor}
                                opacity="0.3"
                            />
                            {/* Foreground terrain */}
                            <path
                                d={`M0,50 L30,${50 - Math.min(40, (data.elevation_meters || 0) / 100)} L70,${50 - Math.min(30, (data.elevation_meters || 0) / 200)} L100,50 Z`}
                                fill={terrainColor}
                                opacity="0.6"
                            />
                        </svg>

                        <div className="z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-t-lg border-t border-x mb-0">
                            <span className="text-2xl font-bold">{data.elevation_meters}</span>
                            <span className="text-sm text-muted-foreground ml-1">m</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-secondary/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <ArrowUp className="h-3 w-3" /> Metric
                                </div>
                                <div className="font-semibold">{data.elevation_meters} meters</div>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <ArrowUp className="h-3 w-3" /> Imperial
                                </div>
                                <div className="font-semibold">{data.elevation_feet} feet</div>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg flex gap-3">
                            <Map className="h-10 w-10 shrink-0 text-primary opacity-50" />
                            <div>
                                <span className="font-medium text-foreground">Terrain Analysis:</span>
                                <br />
                                {data.terrain_type?.description}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
