"use client";

import { Settings, Moon, Globe, Shield, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-40 -mx-4 px-4 py-4 mb-8">
                <h1 className="text-xl font-bold font-outfit text-white">Preferences</h1>
            </div>

            <div className="space-y-6">
                {/* Section 1 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-2">General</h2>
                    <div className="rounded-3xl bg-[#0A0A0F]/60 border border-white/5 overflow-hidden">
                        <SettingItem icon={Globe} label="Units" value="Metric (°C, km/h)" />
                        <div className="h-[1px] bg-white/5 mx-4" />
                        <SettingItem icon={RefreshCw} label="Auto-Refresh" value="Every 30 mins" />
                    </div>
                </section>

                {/* Section 2 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-2">Appearance</h2>
                    <div className="rounded-3xl bg-[#0A0A0F]/60 border border-white/5 overflow-hidden">
                        <SettingItem icon={Moon} label="Theme" value="Nano Dark" />
                        <div className="h-[1px] bg-white/5 mx-4" />
                        <SettingItem icon={Settings} label="Dashboard Layout" value="Default" />
                    </div>
                </section>

                {/* Section 3 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-2">Data</h2>
                    <div className="rounded-3xl bg-[#0A0A0F]/60 border border-white/5 overflow-hidden">
                        <SettingItem icon={Shield} label="Privacy Mode" value="Enabled" toggle />
                    </div>
                </section>
            </div>
        </div>
    );
}

function SettingItem({ icon: Icon, label, value, toggle }: any) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-zinc-200">{label}</span>
            </div>

            {toggle ? (
                <div className="w-12 h-6 rounded-full bg-violet-600/20 border border-violet-500/50 relative">
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
                </div>
            ) : (
                <span className="text-sm text-zinc-500 font-medium">{value}</span>
            )}
        </div>
    )
}
