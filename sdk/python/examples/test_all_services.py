import sys
import os
import asyncio
from datetime import datetime, timedelta

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

async def main():
    print("Testing Adiyogi Weather SDK (Full Capabilities)...")
    
    sdk = WeatherSDK()
    
    # 1. Weather
    print("\n1. Weather (London)")
    weather = await sdk.weather.get_current_async(51.5, -0.1)
    print(f"   Temp: {weather.current.temperature_2m}°C")
    
    # 2. Climate
    print("\n2. Climate (Berlin)")
    start = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")
    end = (datetime.now() + timedelta(days=400)).strftime("%Y-%m-%d")
    climate = await sdk.climate.get_projections_async(52.5, 13.4, start, end)
    print(f"   Projection Points: {len(climate.daily.time)}")
    
    # 3. Flood
    print("\n3. Flood (Paris)")
    flood = await sdk.flood.get_forecast_async(48.8, 2.3)
    if flood.daily.river_discharge:
        print(f"   Max Discharge: {max(flood.daily.river_discharge)} m³/s")
    if flood.flood_risk:
        print(f"   Risk: {flood.flood_risk.level}")
        
    # 4. Elevation
    print("\n4. Elevation (Kathmandu)")
    elev = await sdk.elevation.get_point_async(27.7, 85.3)
    print(f"   Height: {elev.elevation_meters}m")
    print(f"   Terrain: {elev.terrain.type}")
    
    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
