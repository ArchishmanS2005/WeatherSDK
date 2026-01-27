"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Github, Heart, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="font-bold text-xl">About</div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>
            </nav>

            <div className="pt-32 px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text">
                            About Weather
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A beautiful, open-source weather application built with modern web technologies
                        </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 p-8 bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-950 border-2 border-border rounded-3xl"
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            To provide the most beautiful and accessible weather experience on the web. We believe weather data should be free, fast, and presented in a way that's both informative and delightful to use.
                        </p>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">Built With</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: "Next.js 14", description: "React framework with App Router" },
                                { name: "FastAPI", description: "Modern Python web framework" },
                                { name: "TypeScript", description: "Type-safe JavaScript" },
                                { name: "Tailwind CSS", description: "Utility-first CSS framework" },
                                { name: "Framer Motion", description: "Production-ready animations" },
                                { name: "Open-Meteo API", description: "Free weather data API" },
                            ].map((tech, index) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className="p-4 border-2 border-border rounded-xl hover:shadow-lg transition-shadow"
                                >
                                    <div className="font-bold mb-1">{tech.name}</div>
                                    <div className="text-sm text-muted-foreground">{tech.description}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
                        <div className="space-y-4">
                            {[
                                "Real-time weather data for any location worldwide",
                                "7-day detailed forecasts with hourly breakdowns",
                                "80+ years of historical weather data",
                                "Beautiful black & white minimalist design",
                                "Smooth scroll animations and micro-interactions",
                                "Fully responsive across all devices",
                                "No API key required - completely free to use",
                                "Open source and deployable",
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Zap className="w-3 h-3 text-white dark:text-black" />
                                    </div>
                                    <p className="text-lg">{feature}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Open Source */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-8 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 border-2 border-border rounded-3xl text-center"
                    >
                        <Github className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Open Source</h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            This project is open source and free to use. Feel free to fork, modify, and deploy your own version!
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold">
                            <Heart className="w-4 h-4" />
                            <span>Made with love</span>
                        </div>
                    </motion.div>

                    {/* Credits */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-center text-muted-foreground"
                    >
                        <p className="mb-2">Weather data provided by Open-Meteo</p>
                        <p className="text-sm">© 2026 Weather Application. MIT License.</p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
