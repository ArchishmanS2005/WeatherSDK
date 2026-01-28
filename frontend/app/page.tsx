"use client";

import Link from "next/link";
import { ArrowRight, CloudRain, Sparkles, Github } from "lucide-react";
import { motion } from "framer-motion";
import Lightning from "@/components/visuals/Lightning";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-purple-500/30 font-outfit">

      {/* Navbar */}
      <Navbar />

      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Lightning
          hue={230}
          speed={1}
          intensity={1.5}
          size={1}
        />
      </div>

      {/* Overlay Gradient for Text Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Version Badge - Subtle & Professional */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300">v2.0 Nano Engine</span>
          </div>

          {/* Balanced Headline Stack */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            The power of <span className="text-white">nature's fury,</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
              tamed by Adiyogi.
            </span>
          </h1>

          {/* Supporting Subtext for better optical balance */}
          <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
            Harness real-time weather analytics, historical data, and predictive modeling with the world's most advanced environmental SDK.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="group relative px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Launch Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              Read the Docs
            </Link>
          </div>
        </motion.div>
      </section>


    </main>
  );
}
