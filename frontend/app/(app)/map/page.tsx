"use client";

import { Map as MapIcon } from "lucide-react";

export default function MapPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="p-6 rounded-full bg-violet-600/10 border border-violet-500/20">
                <MapIcon className="w-12 h-12 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Interactive Map
            </h1>
            <p className="text-zinc-400 max-w-md">
                Explore weather patterns globally. Radar, precipitation, and wind maps are coming soon to the Pro plan.
            </p>

            <div className="w-full max-w-2xl h-64 rounded-3xl border border-white/5 bg-[#0A0A0F]/50 backdrop-blur-xl mt-8 flex items-center justify-center">
                <span className="text-sm font-code text-zinc-600">Map Module Placeholder</span>
            </div>
        </div>
    );
}
