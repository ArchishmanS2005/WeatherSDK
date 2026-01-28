"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Mountain, TrendingUp, Map } from "lucide-react";
import { searchLocation, getElevation, type LocationResult, type ElevationData } from "@/lib/api";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ElevationPage() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
    const [elevationData, setElevationData] = useState<ElevationData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await searchLocation(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const handleLocationSelect = async (location: LocationResult) => {
        setSelectedLocation(location);
        setSearchResults([]);
        setQuery("");
        setLoading(true);

        try {
            const data = await getElevation(location.latitude, location.longitude);
            setElevationData(data);
        } catch (error) {
            console.error("Failed to fetch elevation:", error);
        } finally {
            setLoading(false);
        }
    };

    // Chart Options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Terrain Profile',
                color: 'rgba(255, 255, 255, 0.8)',
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                },
                title: {
                    display: true,
                    text: 'Elevation (meters)',
                    color: 'rgba(255, 255, 255, 0.6)',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    // Generate Chart Data
    const getChartData = () => {
        if (!elevationData) return null;

        // Create a simple profile visualization (mocking surrounding area if single point)
        // For single point, we'll just show markers, but ideally we'd fetch a path
        // Since API returns single point elevation for now, we'll visualize it as a bar/point

        return {
            labels: ['Location'],
            datasets: [
                {
                    fill: true,
                    label: 'Elevation',
                    data: elevationData.elevation,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.4,
                },
            ],
        };
    };

    return (
        <main className="min-h-screen bg-[#0B0B0F] text-white pb-20">
            {/* Header */}
            <div className="border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </Link>
                    <h1 className="text-xl font-bold font-outfit">Elevation Analysis</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-50"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search any location for terrain analysis..."
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-lg placeholder:text-zinc-600"
                        />
                    </div>

                    {/* Quick Results */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleLocationSelect(result)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{result.name}</div>
                                        <div className="text-sm text-zinc-500">
                                            {result.admin1 && `${result.admin1}, `}{result.country}
                                        </div>
                                    </div>
                                    <Map className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-zinc-400 animate-pulse">Analyzing Terrain Data...</p>
                    </div>
                )}

                {/* Results View */}
                {!loading && elevationData && selectedLocation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Main Stats Card */}
                        <div className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-violet-900/20 border border-white/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-zinc-400 font-medium mb-1">Elevation at</h2>
                                <h3 className="text-3xl font-bold text-white mb-6">{selectedLocation.name}</h3>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-bold text-white font-outfit tracking-tighter">
                                        {Math.round(elevationData.elevation[0])}
                                    </span>
                                    <span className="text-xl text-zinc-400 font-medium">meters</span>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300">
                                        Height: {(elevationData.elevation[0] * 3.28084).toFixed(0)} ft
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300">
                                        Terrain: {elevationData.terrain_type?.type || "Variable"}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background */}
                            <Mountain className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-[-10deg]" />
                        </div>

                        {/* Info Cards */}
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                                <Mountain className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Terrain Type</h4>
                            <p className="text-zinc-400 leading-relaxed">
                                This location matches characteristics of a
                                <span className="text-white font-medium mx-1">
                                    {elevationData.terrain_type?.description || "Mixed Terrain"}
                                </span>
                                environment.
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-violet-400" />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Impact Analysis</h4>
                            <ul className="space-y-2 text-zinc-400 text-sm">
                                <li className="flex items-center gap-2">
                                    • <span className="text-zinc-300">Flood Risk:</span> Lower at higher altitudes
                                </li>
                                <li className="flex items-center gap-2">
                                    • <span className="text-zinc-300">Temperature:</span> -0.6°C per 100m gain
                                </li>
                                <li className="flex items-center gap-2">
                                    • <span className="text-zinc-300">UV Exposure:</span> +4% per 300m gain
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !elevationData && (
                    <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <Mountain className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Explore</h3>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            Search for any city, mountain, or landmark to get precise elevation data and terrain analysis.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
