"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Book, Code, Terminal, Layers, Zap, Shield, Copy, Check, ChevronRight, Sparkles, Package, FileCode } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function DocsPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Animated Background */}
            <div className="fixed inset-0 bg-black">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-black to-purple-500/5" />
            </div>

            {/* Progress Bar */}
            <motion.div
                className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-8 relative z-10">
                {/* Sidebar Navigation */}
                <aside className="col-span-3 hidden lg:block sticky top-28 h-[calc(100vh-8rem)]">
                    <nav className="space-y-8">
                        <NavSection title="Getting Started" items={[
                            { label: "Introduction", href: "#intro", active: true },
                            { label: "Installation", href: "#installation" },
                            { label: "Quickstart", href: "#quickstart" },
                        ]} />
                        <NavSection title="SDKs" items={[
                            { label: "TypeScript/JavaScript", href: "#typescript" },
                            { label: "Python", href: "#python" },
                        ]} />
                        <NavSection title="API Reference" items={[
                            { label: "Weather API", href: "#weather" },
                            { label: "Historical Data", href: "#historical" },
                            { label: "Elevation", href: "#elevation" },
                        ]} />
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="col-span-12 lg:col-span-9 space-y-20">
                    {/* Hero Introduction */}
                    <AnimatedSection id="intro">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-blue-400 font-semibold">Nano Engine v2.0</span>
                            </div>
                            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-br from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight">
                                Adiyogi SDK
                            </h1>
                            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-3xl">
                                A powerful, type-safe SDK for accessing high-precision weather, climate, and environmental data.
                                Designed for data scientists, developers, and researchers worldwide.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <FeatureCard icon={Zap} title="Lightning Fast" desc="Async-first with optimal performance" gradient="from-yellow-500 to-orange-500" />
                                <FeatureCard icon={Shield} title="Type Safe" desc="Full TypeScript & Pydantic support" gradient="from-blue-500 to-cyan-500" />
                                <FeatureCard icon={Package} title="Tree-shakable" desc="Import only what you need" gradient="from-purple-500 to-pink-500" />
                            </div>
                        </motion.div>
                    </AnimatedSection>

                    {/* Installation */}
                    <AnimatedSection id="installation">
                        <SectionHeader icon={Terminal} title="Installation" subtitle="Get started in seconds" />
                        
                        <div className="space-y-4">
                            <InstallCommand
                                label="npm"
                                command="npm install @adiyogi/weather-sdk"
                                language="bash"
                            />
                            <InstallCommand
                                label="yarn"
                                command="yarn add @adiyogi/weather-sdk"
                                language="bash"
                            />
                            <InstallCommand
                                label="pip"
                                command="pip install adiyogi-weather"
                                language="bash"
                            />
                        </div>
                    </AnimatedSection>

                    {/* TypeScript SDK */}
                    <AnimatedSection id="typescript">
                        <SectionHeader
                            icon={FileCode}
                            title="TypeScript SDK"
                            subtitle="Type-safe weather data for your JavaScript projects"
                        />
                        
                        <div className="space-y-6">
                            <CodeBlock
                                title="Basic Usage"
                                language="typescript"
                                code={`import { AdiyogiClient } from '@adiyogi/weather-sdk';

const client = new AdiyogiClient({
  apiKey: process.env.ADIYOGI_API_KEY
});

// Get current weather
const weather = await client.weather.getCurrent({
  lat: 40.7128,
  lon: -74.0060
});

console.log(\`Temperature: \${weather.temperature}°C\`);
console.log(\`Condition: \${weather.condition}\`);`}
                            />

                            <CodeBlock
                                title="7-Day Forecast"
                                language="typescript"
                                code={`// Get 7-day forecast with hourly data
const forecast = await client.weather.getForecast({
  lat: 40.7128,
  lon: -74.0060,
  days: 7,
  includeHourly: true
});

forecast.daily.forEach(day => {
  console.log(\`\${day.date}: \${day.temperature.max}°C\`);
});`}
                            />

                            <CodeBlock
                                title="React Hook"
                                language="typescript"
                                code={`import { useWeather } from '@adiyogi/weather-sdk/react';

function WeatherWidget() {
  const { data, loading, error } = useWeather({
    lat: 40.7128,
    lon: -74.0060,
    refreshInterval: 60000 // 1 minute
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h2>{data.temperature}°C</h2>
      <p>{data.condition}</p>
    </div>
  );
}`}
                            />
                        </div>
                    </AnimatedSection>

                    {/* Python SDK */}
                    <AnimatedSection id="python">
                        <SectionHeader
                            icon={Terminal}
                            title="Python SDK"
                            subtitle="Async-first Python SDK with Pydantic models"
                        />
                        
                        <div className="space-y-6">
                            <CodeBlock
                                title="Basic Usage"
                                language="python"
                                code={`from adiyogi_weather import Adiyogi
import asyncio

async def main():
    async with Adiyogi() as client:
        # Get current weather
        weather = await client.weather.get_current(
            lat=40.7128,
            lon=-74.0060
        )
        
        print(f"Temperature: {weather.temperature}°C")
        print(f"Condition: {weather.condition}")

if __name__ == "__main__":
    asyncio.run(main())`}
                            />

                            <CodeBlock
                                title="7-Day Forecast"
                                language="python"
                                code={`async def get_forecast():
    async with Adiyogi() as client:
        forecast = await client.weather.get_forecast(
            lat=40.7128,
            lon=-74.0060,
            days=7
        )
        
        for day in forecast.daily:
            print(f"{day.date}: {day.temperature.max}°C")`}
                            />

                            <CodeBlock
                                title="Historical Data"
                                language="python"
                                code={`from datetime import datetime, timedelta

async def get_historical():
    async with Adiyogi() as client:
        # Get weather from last week
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        historical = await client.historical.get_range(
            lat=40.7128,
            lon=-74.0060,
            start_date=start_date,
            end_date=end_date
        )
        
        print(f"Average temp: {historical.avg_temperature}°C")`}
                            />
                        </div>
                    </AnimatedSection>

                    {/* API Services */}
                    <AnimatedSection id="weather">
                        <SectionHeader
                            icon={Layers}
                            title="Available Services"
                            subtitle="Comprehensive weather and environmental data"
                        />
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                            <ServiceCard
                                title="Weather API"
                                description="Current conditions, hourly & daily forecasts, alerts"
                                gradient="from-blue-500 to-cyan-500"
                            />
                            <ServiceCard
                                title="Historical Data"
                                description="80+ years of climate archive for analysis"
                                gradient="from-purple-500 to-pink-500"
                            />
                            <ServiceCard
                                title="Elevation API"
                                description="High-precision terrain mapping and topography"
                                gradient="from-green-500 to-emerald-500"
                            />
                            <ServiceCard
                                title="Marine Data"
                                description="Wave height, ocean currents, and swell forecasts"
                                gradient="from-cyan-500 to-blue-500"
                            />
                            <ServiceCard
                                title="Air Quality"
                                description="Global AQI, PM2.5, and pollutant tracking"
                                gradient="from-orange-500 to-red-500"
                            />
                            <ServiceCard
                                title="Solar & UV"
                                description="Solar radiation and UV index predictions"
                                gradient="from-yellow-500 to-orange-500"
                            />
                        </div>
                    </AnimatedSection>

                    {/* Footer CTA */}
                    <AnimatedSection>
                        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-12 text-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl" />
                            <div className="relative z-10">
                                <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
                                <p className="text-xl text-zinc-300 mb-8">Start integrating Adiyogi SDK into your applications today.</p>
                                <div className="flex items-center justify-center gap-4">
                                    <Link
                                        href="/dashboard"
                                        className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
                                    >
                                        Launch Dashboard
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </main>
    );
}

// Components
function AnimatedSection({ children, id }: { children: React.ReactNode; id?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            id={id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="scroll-mt-24"
        >
            {children}
        </motion.section>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-lg text-zinc-400">{subtitle}</p>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, gradient }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer"
        >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400">{desc}</p>
        </motion.div>
    );
}

function InstallCommand({ label, command, language }: { label: string; command: string; language: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all" />
            <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-lg bg-white/5 text-xs font-bold text-zinc-400 uppercase">{label}</span>
                    <code className="text-blue-300 font-mono">{command}</code>
                </div>
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function CodeBlock({ title, code, language }: { title: string; code: string; language: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all" />
            <div className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-zinc-400 uppercase">{language}</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3 text-green-400" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                Copy
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed">
                    {code}
                </pre>
            </div>
        </motion.div>
    );
}

function ServiceCard({ title, description, gradient }: { title: string; description: string; gradient: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer overflow-hidden"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-zinc-400">{description}</p>
            </div>
            <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </motion.div>
    );
}

function NavSection({ title, items }: { title: string; items: { label: string; href: string; active?: boolean }[] }) {
    return (
        <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.href}>
                        <a
                            href={item.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                                item.active
                                    ? "bg-blue-500/10 text-blue-400 font-medium"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
