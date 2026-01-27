import sys
import os
import asyncio
from datetime import datetime, timedelta

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

async def main():
    print("Testing Adiyogi Weather SDK (COMPLETE Feature Set)...")
    
    sdk = WeatherSDK()
    
    # 5. Geocoding
    print("\n5. Geocoding (search 'Tokyo')")
    locations = await sdk.geocoding.search_async("Tokyo")
    if locations:
        tokyo_loc = locations[0]
        print(f"   Found: {tokyo_loc.name}, {tokyo_loc.country} ({tokyo_loc.latitude}, {tokyo_loc.longitude})")
        
        # Use Tokyo coords for other tests
        lat, lon = tokyo_loc.latitude, tokyo_loc.longitude
    else:
        print("   ❌ Location not found")
        lat, lon = 35.68, 139.77

    # 6. Air Quality
    print(f"\n6. Air Quality ({lat}, {lon})")
    aqi = await sdk.air_quality.get_current_async(lat, lon)
    print(f"   European AQI: {aqi.current.european_aqi}")
    print(f"   PM2.5: {aqi.current.pm2_5} μg/m³")
    
    # 7. Solar
    print(f"\n7. Solar ({lat}, {lon})")
    solar = await sdk.solar.get_forecast_async(lat, lon)
    print(f"   Direct Radiation (next hour): {solar.hourly.direct_radiation[0]} W/m²")
    
    # 8. Marine (somewhere in ocean - Hawaii)
    hawaii_lat, hawaii_lon = 21.3, -157.8
    print(f"\n8. Marine (Hawaii: {hawaii_lat}, {hawaii_lon})")
    marine = await sdk.marine.get_current_async(hawaii_lat, hawaii_lon)
    print(f"   Wave Height: {marine.current.wave_height} m")
    
    # 9. Historical (Berlin 2023)
    print("\n9. Historical (Berlin 2023-01-01 to 2023-01-31)")
    hist = await sdk.historical.get_weather_async(52.52, 13.41, "2023-01-01", "2023-01-31")
    if hist.daily.temperature_2m_max:
        avg_max = sum(hist.daily.temperature_2m_max) / len(hist.daily.temperature_2m_max)
        print(f"   Avg Max Temp (Jan 2023): {avg_max:.2f}°C")
    
    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
