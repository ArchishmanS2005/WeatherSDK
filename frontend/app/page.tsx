"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cloud, Zap, TrendingUp, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Cloud,
      title: "Real-Time Forecasts",
      description: "Get accurate weather predictions powered by Open-Meteo's advanced models",
    },
    {
      icon: TrendingUp,
      title: "Historical Data",
      description: "Explore 80 years of weather history and analyze climate trends",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Weather data for any location worldwide with 11km resolution",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-10ms response times with intelligent caching",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 blur-3xl"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating Elements */}
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-black/10 dark:bg-white/10 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full mb-8 border border-black/10 dark:border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by Open-Meteo</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter">
              <span className="gradient-text">Weather</span>
            </h1>

            <p className="text-2xl md:text-4xl text-muted-foreground mb-4 font-light max-w-3xl mx-auto">
              The most sophisticated weather experience
            </p>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Real-time forecasts, historical data, and climate insights—all in one beautiful, minimalist interface
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/weather">
                <motion.button
                  className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/historical">
                <motion.button
                  className="px-8 py-4 border-2 border-black dark:border-white rounded-full font-semibold text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore History
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Discover more</span>
              <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-2 bg-current rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete weather platform with cutting-edge features and beautiful design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group p-8 border-2 border-border rounded-3xl hover:shadow-2xl transition-all bg-white dark:bg-black"
              >
                <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white dark:text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { value: "80+", label: "Years of Data" },
              { value: "11km", label: "Resolution" },
              { value: "<10ms", label: "Response Time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl md:text-7xl font-black mb-4 gradient-text">
                  {stat.value}
                </div>
                <div className="text-xl text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to explore?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Start your journey with the most beautiful weather app
          </p>
          <Link href="/weather">
            <motion.button
              className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch App
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-muted-foreground">
              <p className="mb-2">Powered by Open-Meteo API • Built with Next.js & FastAPI</p>
              <p className="text-sm">© 2026 Weather. Open source and free to use.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium hover:opacity-70 transition-opacity">
                About
              </Link>
              <Link href="/weather" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Weather
              </Link>
              <Link href="/historical" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Historical
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
