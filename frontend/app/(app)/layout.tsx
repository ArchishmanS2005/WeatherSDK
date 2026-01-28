"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeWrapper>
            <div className="flex min-h-screen relative overflow-hidden bg-[#0A0A0F]">
                <AppSidebar />

                <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 relative z-10">
                    <Header />
                    <main className="flex-1 p-6 md:p-8 lg:p-10 mx-auto w-full max-w-7xl animate-fade-in text-white">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeWrapper>
    );
}
