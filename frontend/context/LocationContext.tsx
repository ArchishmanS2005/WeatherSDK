"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getReverseGeocode } from "@/lib/api";

interface LocationState {
    lat: number;
    lon: number;
    city: string;
    loading: boolean;
    error: string | null;
}

interface LocationContextType extends LocationState {
    setLocation: (lat: number, lon: number, city?: string) => void;
    detectLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<LocationState>({
        lat: 22.5726, // Default: Kolkata
        lon: 88.3639,
        city: "Kolkata",
        loading: false,
        error: null,
    });

    const setLocation = (lat: number, lon: number, city?: string) => {
        setState(prev => ({ ...prev, lat, lon, city: city || prev.city }));
    };

    const detectLocation = async () => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: "Geolocation is not supported by your browser" }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Detected coordinates:", latitude, longitude);
                try {
                    const data = await getReverseGeocode(latitude, longitude);
                    // Use returned name, or fallback to sensible defaults logic
                    const locationName = data.name || data.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                    setState({
                        lat: latitude,
                        lon: longitude,
                        city: locationName,
                        loading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                    setState({
                        lat: latitude,
                        lon: longitude,
                        city: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, // Fallback directly to coords
                        loading: false,
                        error: "Could not fetch city name, using coordinates"
                    });
                }
            },
            (error: GeolocationPositionError) => {
                console.error("Geolocation error:", {
                    code: error.code,
                    message: error.message,
                    PERMISSION_DENIED: error.PERMISSION_DENIED,
                    POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
                    TIMEOUT: error.TIMEOUT
                });
                setState(prev => ({ ...prev, loading: false, error: "Unable to retrieve your location: " + error.message }));
            }
        );
    };

    return (
        <LocationContext.Provider value={{ ...state, setLocation, detectLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) throw new Error("useLocation must be used within LocationProvider");
    return context;
}
