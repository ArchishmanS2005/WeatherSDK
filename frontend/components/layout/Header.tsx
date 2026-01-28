"use client";

import { Search, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { searchLocation } from "@/lib/api";

export function Header() {
    const { detectLocation, setLocation, city, loading } = useLocation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 2) {
            setIsSearching(true);
            try {
                const res = await searchLocation(val);
                setResults(res || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        } else {
            setResults([]);
        }
    };

    const selectCity = (item: any) => {
        setLocation(item.latitude, item.longitude, item.name);
        setQuery("");
        setResults([]);
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 py-4 sticky top-0 bg-[#0A0A0F]/80 backdrop-blur-md z-40">
            {/* Search Bar */}
            <div className="relative group w-96 hidden md:block z-50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-2.5 transition-all duration-300 focus-within:bg-white/10 focus-within:border-white/20">
                    <Search className="w-5 h-5 text-zinc-400 mr-3" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search for cities..."
                        className="bg-transparent border-none outline-none text-white placeholder-zinc-500 w-full font-medium"
                    />
                </div>

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {results.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => selectCity(item)}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group/item transition-colors"
                            >
                                <div>
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-xs text-zinc-400">{item.admin1}, {item.country}</p>
                                </div>
                                <MapPin className="w-4 h-4 text-zinc-500 group-hover/item:text-blue-400 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={detectLocation}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    <span className="text-sm font-medium hidden sm:block">Locate Me</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">{city}</span>
                </div>
            </div>
        </header>
    );
}
