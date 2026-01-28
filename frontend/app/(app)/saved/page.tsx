"use client";

import { Heart, MoreHorizontal, ArrowRight } from "lucide-react";

const savedCities = [
    { name: "Tokyo", temp: "18°", condition: "Clear", color: "from-blue-500 to-cyan-400" },
    { name: "New York", temp: "12°", condition: "Rain", color: "from-indigo-500 to-purple-500" },
    { name: "London", temp: "8°", condition: "Cloudy", color: "from-gray-500 to-zinc-400" },
];

export default function SavedCitiesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Saved Locations</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCities.map((city) => (
                    <div
                        key={city.name}
                        className="group relative h-40 rounded-3xl overflow-hidden p-6 border border-white/5 hover:border-white/20 transition-all duration-300"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${city.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="absolute inset-0 bg-[#0A0A0F]/40 backdrop-blur-md z-0" />

                        <div className="relative z-10 flex justify-between items-start h-full">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{city.name}</h2>
                                    <p className="text-zinc-400">{city.condition}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500 group-hover:text-white transition-colors cursor-pointer">
                                    See Forecast <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between h-full">
                                <button className="text-zinc-500 hover:text-white transition-colors">
                                    <Heart className="w-5 h-5 fill-current text-red-500" />
                                </button>
                                <span className="text-4xl font-bold text-white">{city.temp}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button className="h-40 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-white hover:border-white/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="font-medium">Add City</span>
                </button>
            </div>
        </div>
    );
}
