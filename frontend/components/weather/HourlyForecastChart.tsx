"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface HourlyForecastChartProps {
    data: any[];
}

export function HourlyForecastChart({ data }: HourlyForecastChartProps) {
    // Use passed data or empty array to prevent crash, but prefer passed data
    const chartData = data && data.length > 0 ? data : [];

    return (
        <div className="h-[180px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => {
                            try {
                                return format(new Date(time), "HH:mm");
                            } catch (e) {
                                return "";
                            }
                        }}
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length && label) {
                                return (
                                    <div className="bg-[#0A0A0F]/90 border border-white/10 p-3 rounded-xl backdrop-blur-md shadow-xl">
                                        <p className="text-zinc-400 text-xs mb-1">
                                            {/* Safe date formatting */}
                                            {(() => {
                                                try {
                                                    return format(new Date(label), "h:mm a");
                                                } catch (e) {
                                                    return "--:--";
                                                }
                                            })()}
                                        </p>
                                        <p className="text-white font-bold text-lg">
                                            {payload[0].value}°
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="temp_c"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTemp)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
