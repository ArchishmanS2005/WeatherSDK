"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, TrendingUp } from "lucide-react";
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

    // Set default dates (last 30 days)
    const setDefaultDates = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);

        setEndDate(end.toISOString().split('T')[0]);
        setStartDate(start.toISOString().split('T')[0]);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-black">
            {/* Navigation */}
            <div className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Home
                    </Link>
                    <div className="flex gap-4 text-sm">
                        <Link href="/weather" className="hover:text-muted-foreground transition-colors">
                            Weather
                        </Link>
                        <Link href="/about" className="hover:text-muted-foreground transition-colors">
                            About
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="px-4 py-16 border-b border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6">
                            <span className="gradient-text">Historical Weather</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Explore 80+ years of climate data with interactive charts
                        </p>
                    </motion.div>

                    {/* Search and Date Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-black border-2 border-border rounded-2xl p-6 space-y-4"
                    >
                        {/* Location Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for a location..."
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-border rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            />

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border-2 border-border rounded-xl overflow-hidden z-10 shadow-2xl">
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleLocationSelect(result)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors border-b border-border last:border-b-0"
                                        >
                                            <div className="font-medium">{result.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {result.admin1 && `${result.admin1}, `}{result.country}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Location */}
                        {selectedLocation && (
                            <div className="text-left p-4 bg-gray-50 dark:bg-gray-950 rounded-xl">
                                <div className="text-sm text-muted-foreground mb-1">Selected Location</div>
                                <div className="font-bold text-lg">
                                    {selectedLocation.name}, {selectedLocation.country}
                                </div>
                            </div>
                        )}

                        {/* Date Range Selection */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min="1940-01-01"
                                        max={endDate || new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-border rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || "1940-01-01"}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-border rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Date Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setDate(start.getDate() - 30);
                                    setStartDate(start.toISOString().split('T')[0]);
                                    setEndDate(end.toISOString().split('T')[0]);
                                }}
                                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
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
                                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
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
                                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                            >
                                Last 10 Years
                            </button>
                        </div>

                        {/* Fetch Button */}
                        <button
                            onClick={handleFetchData}
                            disabled={!selectedLocation || !startDate || !endDate || loading}
                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Loading..." : "Fetch Historical Data"}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Historical Data Display */}
            {historicalData && selectedLocation && (
                <section className="px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <HistoricalChart
                            data={historicalData}
                            locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                        />
                    </div>
                </section>
            )}

            {/* Features Section (shown when no data) */}
            {!historicalData && (
                <section className="px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Climate Trends</h3>
                                <p className="text-muted-foreground">
                                    Analyze temperature and precipitation patterns over decades
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">80 Years of Data</h3>
                                <p className="text-muted-foreground">
                                    Access historical weather data from 1940 to present
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Interactive Charts</h3>
                                <p className="text-muted-foreground">
                                    Beautiful visualizations with temperature and precipitation trends
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
