"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchLocation, LocationResult } from "@/lib/api";

interface WeatherHeroProps {
    onLocationSelect: (location: LocationResult) => void;
}

export function WeatherHero({ onLocationSelect }: WeatherHeroProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (value: string) => {
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const locations = await searchLocation(value);
            setResults(locations);
            setShowResults(true);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (location: LocationResult) => {
        setQuery(`${location.name}, ${location.country}`);
        setShowResults(false);
        onLocationSelect(location);
    };

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                        <span className="gradient-text">Weather</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light">
                        Sophisticated forecasts for the modern world
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative max-w-2xl mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search for a city..."
                            className="w-full pl-14 pr-6 py-5 text-lg bg-white dark:bg-black border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
                        />
                    </div>

                    {/* Search Results */}
                    <AnimatePresence>
                        {showResults && results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-2 w-full bg-white dark:bg-black border-2 border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                {results.map((location, index) => (
                                    <motion.button
                                        key={location.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleSelectLocation(location)}
                                        className="w-full px-6 py-4 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b border-border last:border-0"
                                    >
                                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">{location.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {location.admin1 && `${location.admin1}, `}
                                                {location.country}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20"
                >
                    <div className="inline-flex flex-col items-center gap-2 text-muted-foreground">
                        <span className="text-sm font-medium">Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2"
                        >
                            <div className="w-1 h-2 bg-current rounded-full" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
