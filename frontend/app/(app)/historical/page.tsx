"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, TrendingUp, Clock, Map } from "lucide-react";
import { searchLocation, getHistoricalWeather, type LocationResult, type HistoricalData } from "@/lib/api";
import { HistoricalChart } from "@/components/weather/historical-chart";

export default function HistoricalPage() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const results = await searchLocation(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleLocationSelect = (location: LocationResult) => {
        setSelectedLocation(location);
        setSearchResults([]);
        setQuery("");
    };

    const handleFetchData = async () => {
        if (!selectedLocation || !startDate || !endDate) {
            return;
        }

        setLoading(true);
        try {
            const data = await getHistoricalWeather(
                selectedLocation.latitude,
                selectedLocation.longitude,
                startDate,
                endDate
            );
            setHistoricalData(data);
        } catch (error) {
            console.error("Failed to fetch historical data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0B0B0F] text-white  pb-20">
            {/* Header */}
            <div className="border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </Link>
                    <h1 className="text-xl font-bold font-outfit">Historical Analysis</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-outfit">
                        Time Machine
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Explore 80+ years of global climate data
                    </p>
                </motion.div>

                {/* Controls Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative z-30"
                >
                    <div className="grid gap-6">
                        {/* Location Search */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search for a city..."
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleLocationSelect(result)}
                                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group"
                                        >
                                            <div>
                                                <div className="font-medium text-white group-hover:text-blue-400">{result.name}</div>
                                                <div className="text-sm text-zinc-500">
                                                    {result.admin1 && `${result.admin1}, `}{result.country}
                                                </div>
                                            </div>
                                            <Map className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Indicator */}
                        {selectedLocation && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Map className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-100">{selectedLocation.name}</p>
                                    <p className="text-xs text-blue-300/60">{selectedLocation.country}</p>
                                </div>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min="1940-01-01"
                                        max={endDate || new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-300 color-scheme-dark"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || "1940-01-01"}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setDate(start.getDate() - 30);
                                    setStartDate(start.toISOString().split('T')[0]);
                                    setEndDate(end.toISOString().split('T')[0]);
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setFullYear(start.getFullYear() - 1);
                                    setStartDate(start.toISOString().split('T')[0]);
                                    setEndDate(end.toISOString().split('T')[0]);
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                Last Year
                            </button>
                            <button
                                onClick={() => {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setFullYear(start.getFullYear() - 10);
                                    setStartDate(start.toISOString().split('T')[0]);
                                    setEndDate(end.toISOString().split('T')[0]);
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                Last 10 Years
                            </button>
                        </div>

                        {/* Fetch Button */}
                        <button
                            onClick={handleFetchData}
                            disabled={!selectedLocation || !startDate || !endDate || loading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Retrieving Archives...
                                </span>
                            ) : (
                                "Fetch Historical Data"
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Data Display */}
                {historicalData && selectedLocation && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-[#0A0A0F] border border-white/5 overflow-hidden"
                    >
                        <div className="p-6">
                            <HistoricalChart
                                data={historicalData}
                                locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                            />
                        </div>
                    </motion.section>
                )}

                {/* Empty State Features */}
                {!historicalData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid md:grid-cols-3 gap-6 pt-8"
                    >
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">Climate Trends</h3>
                            <p className="text-sm text-zinc-400">Analyze long-term temperature shifts and precipitation patterns.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">80+ Years Data</h3>
                            <p className="text-sm text-zinc-400">Access reliable archival weather data directly from global stations.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-violet-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">Deep Analysis</h3>
                            <p className="text-sm text-zinc-400">Compare past seasons to predict future climate behaviors.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
