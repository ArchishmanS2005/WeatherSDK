"use client";

import { Home, Map, Settings, Heart, CloudRain, TrendingUp, Book } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "History", href: "/historical" },
    { icon: TrendingUp, label: "Elevation", href: "/elevation" },
    { icon: Book, label: "Documentation", href: "/docs" },
    { icon: Heart, label: "Saved Cities", href: "/saved" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-[#0A0A0F]/50 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col p-4 transition-all duration-300">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CloudRain className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 hidden lg:block">
                    Adiyogi
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden",
                                isActive
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-white/5 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <Icon className={cn("w-6 h-6 z-10", isActive && "text-blue-400")} />
                            <span className="font-medium z-10 hidden lg:block">{item.label}</span>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
