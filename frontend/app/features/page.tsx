"use client";

import React from "react";
import { ArrowLeft, CloudRain, Sparkles, Zap, Globe, Shield, Cpu, Database, Cloud } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function FeaturesPage() {
    const features = [
        { icon: Zap, title: "Real-time Updates", description: "Live weather data refreshed every minute", color: "from-yellow-500 to-orange-500" },
        { icon: Globe, title: "Global Coverage", description: "Weather data from anywhere on Earth", color: "from-blue-500 to-cyan-500" },
        { icon: Shield, title: "Enterprise Security", description: "Bank-level encryption for your data", color: "from-purple-500 to-pink-500" },
        { icon: Cpu, title: "AI Predictions", description: "Machine learning powered forecasts", color: "from-green-500 to-emerald-500" },
        { icon: Database, title: "Historical Data", description: "Access decades of weather records", color: "from-red-500 to-rose-500" },
        { icon: Cloud, title: "Cloud Native", description: "Built for scale and reliability", color: "from-indigo-500 to-violet-500" },
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden" style={{ backgroundColor: '#000000' }}>
            {/* Navbar */}
            <Navbar />

            {/* Animated Background Grid */}
            <div className="fixed inset-0 bg-black" style={{ backgroundColor: '#000000' }}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">Powered by Nano Engine v2.0</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
                            Intelligence <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                at Planetary Scale
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
                            Adiyogi processes petabytes of environmental data into actionable insights.
                            Explore the modules that power our next-generation SDK.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                                    
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none" />
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <p className="text-zinc-500 text-sm mb-6">Ready to build the future?</p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
                        >
                            Launch Dashboard
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
