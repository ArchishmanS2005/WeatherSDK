"use client";

import { useState, useEffect } from "react";
import { WeatherHero } from "@/components/weather/weather-hero";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { ForecastCards } from "@/components/weather/forecast-cards";
import { AirQualityCard } from "@/components/weather/air-quality-card";
import { MarineConditionsCard } from "@/components/weather/marine-conditions-card";
import { SolarRadiationCard } from "@/components/weather/solar-radiation-card";
import ClimateCard from "@/components/weather/climate-card";
import FloodCard from "@/components/weather/flood-card";
import ElevationCard from "@/components/weather/elevation-card";
import { LocationResult, getCurrentWeather, getForecast, WeatherResponse } from "@/lib/api";
import { Loader2, ArrowLeft, Wind, Waves, Sun, Thermometer, CloudRain, Mountain } from "lucide-react";
import Link from "next/link";

export default function WeatherPage() {
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
    const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(null);
    const [forecast, setForecast] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'weather' | 'air-quality' | 'marine' | 'solar' | 'climate' | 'flood' | 'elevation'>('weather');

    useEffect(() => {
        if (selectedLocation) {
            loadWeatherData(selectedLocation);
        }
    }, [selectedLocation]);

    const loadWeatherData = async (location: LocationResult) => {
        setLoading(true);
        setError(null);

        try {
            const [current, forecastData] = await Promise.all([
                getCurrentWeather(location.latitude, location.longitude),
                getForecast(location.latitude, location.longitude, 7),
            ]);

            setCurrentWeather(current);
            setForecast(forecastData);
        } catch (err) {
            setError("Failed to load weather data. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="font-bold text-xl">Weather Dashboard</div>
                    <Link href="/historical" className="text-sm font-medium hover:opacity-70 transition-opacity">
                        Historical Data
                    </Link>
                </div>
            </nav>

            <div className="pt-20">
                <WeatherHero onLocationSelect={setSelectedLocation} />

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="max-w-2xl mx-auto px-4 py-8">
                        <div className="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && selectedLocation && (
                    <>
                        {/* Tab Navigation */}
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setActiveTab('weather')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'weather'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Wind className="w-4 h-4" />
                                    Weather
                                </button>
                                <button
                                    onClick={() => setActiveTab('air-quality')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'air-quality'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Wind className="w-4 h-4" />
                                    Air Quality
                                </button>
                                <button
                                    onClick={() => setActiveTab('marine')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'marine'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Waves className="w-4 h-4" />
                                    Marine
                                </button>
                                <button
                                    onClick={() => setActiveTab('solar')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'solar'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Sun className="w-4 h-4" />
                                    Solar
                                </button>
                                <button
                                    onClick={() => setActiveTab('climate')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'climate'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Thermometer className="w-4 h-4" />
                                    Climate
                                </button>
                                <button
                                    onClick={() => setActiveTab('flood')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'flood'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <CloudRain className="w-4 h-4" />
                                    Flood
                                </button>
                                <button
                                    onClick={() => setActiveTab('elevation')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'elevation'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Mountain className="w-4 h-4" />
                                    Elevation
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="max-w-7xl mx-auto px-4 pb-16">
                            {activeTab === 'weather' && currentWeather && (
                                <>
                                    <CurrentWeatherCard
                                        weather={currentWeather.current!}
                                        locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                                        units={currentWeather.units}
                                    />
                                    {forecast && forecast.daily && (
                                        <div className="mt-8">
                                            <ForecastCards forecast={forecast.daily} units={forecast.units} />
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'air-quality' && (
                                <AirQualityCard
                                    latitude={selectedLocation.latitude}
                                    longitude={selectedLocation.longitude}
                                    locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                                />
                            )}

                            {activeTab === 'marine' && (
                                <MarineConditionsCard
                                    latitude={selectedLocation.latitude}
                                    longitude={selectedLocation.longitude}
                                    locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                                />
                            )}

                            {activeTab === 'solar' && (
                                <SolarRadiationCard
                                    latitude={selectedLocation.latitude}
                                    longitude={selectedLocation.longitude}
                                    locationName={`${selectedLocation.name}, ${selectedLocation.country}`}
                                />
                            )}

                            {activeTab === 'climate' && (
                                <ClimateCard
                                    lat={selectedLocation.latitude}
                                    lon={selectedLocation.longitude}
                                />
                            )}

                            {activeTab === 'flood' && (
                                <FloodCard
                                    lat={selectedLocation.latitude}
                                    lon={selectedLocation.longitude}
                                />
                            )}

                            {activeTab === 'elevation' && (
                                <ElevationCard
                                    lat={selectedLocation.latitude}
                                    lon={selectedLocation.longitude}
                                />
                            )}
                        </div>
                    </>
                )}

                {!selectedLocation && !loading && (
                    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                        <p className="text-xl text-muted-foreground">
                            Search for a city to view comprehensive weather data
                        </p>
                        <div className="mt-8 grid md:grid-cols-4 gap-4 text-sm">
                            <div className="p-4 border border-border rounded-xl">
                                <Wind className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Weather</div>
                                <div className="text-muted-foreground text-xs">Current & 7-day forecast</div>
                            </div>
                            <div className="p-4 border border-border rounded-xl">
                                <Wind className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Air Quality</div>
                                <div className="text-muted-foreground text-xs">AQI & pollutants</div>
                            </div>
                            <div className="p-4 border border-border rounded-xl">
                                <Waves className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Marine</div>
                                <div className="text-muted-foreground text-xs">Waves & currents</div>
                            </div>
                            <div className="p-4 border border-border rounded-xl">
                                <Sun className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Solar</div>
                                <div className="text-muted-foreground text-xs">Radiation & energy</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-border mt-20">
                <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
                    <p>Powered by Open-Meteo API • Built with Next.js & FastAPI</p>
                    <p className="mt-2">Weather • Air Quality • Marine • Solar • Historical Data</p>
                </div>
            </footer>
        </main>
    );
}
