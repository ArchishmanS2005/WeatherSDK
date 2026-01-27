"use client";

import { DailyForecast } from "@/lib/api";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Sunrise, Sunset, Droplets } from "lucide-react";

interface ForecastCardsProps {
    forecast: DailyForecast;
    units: {
        temperature: string;
    };
}

export function ForecastCards({ forecast, units }: ForecastCardsProps) {
    const days = forecast.time.map((date, index) => ({
        date,
        tempMax: forecast.temperature_max[index],
        tempMin: forecast.temperature_min[index],
        weatherCode: forecast.weather_code[index],
        precipitation: forecast.precipitation_sum[index],
        precipProb: forecast.precipitation_probability_max[index],
        sunrise: forecast.sunrise[index],
        sunset: forecast.sunset[index],
        uvIndex: forecast.uv_index_max[index],
    }));

    return (
        <section className="px-4 py-16 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
                        7-Day Forecast
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {days.slice(0, 7).map((day, index) => (
                        <ScrollReveal key={day.date} delay={index * 0.1}>
                            <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                {/* Day & Date */}
                                <div className="mb-4">
                                    <div className="text-lg font-bold">
                                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Weather Icon */}
                                <div className="text-5xl mb-4 text-center">
                                    {getWeatherEmoji(day.weatherCode)}
                                </div>

                                {/* Temperature */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {Math.round(day.tempMax)}°
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            High
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-semibold text-muted-foreground">
                                            {Math.round(day.tempMin)}°
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Low
                                        </div>
                                    </div>
                                </div>

                                {/* Precipitation */}
                                {day.precipitation > 0 && (
                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <Droplets className="w-4 h-4 text-blue-500" />
                                        <span>{day.precipitation.toFixed(1)} mm ({day.precipProb}%)</span>
                                    </div>
                                )}

                                {/* Sunrise & Sunset */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                                    <div className="flex items-center gap-1">
                                        <Sunrise className="w-3 h-3" />
                                        <span>{new Date(day.sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Sunset className="w-3 h-3" />
                                        <span>{new Date(day.sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function getWeatherEmoji(code: number): string {
    const emojiMap: { [key: number]: string } = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌦️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        71: '🌨️',
        73: '🌨️',
        75: '🌨️',
        80: '🌦️',
        81: '🌧️',
        82: '⛈️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️',
    };
    return emojiMap[code] || '🌤️';
}
