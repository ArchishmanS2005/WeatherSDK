import sys
import os
import asyncio
from datetime import datetime, timedelta

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

def main():
    print("Testing Adiyogi Weather SDK (Climate)...")
    
    sdk = WeatherSDK()
    
    start_date = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")
    end_date = (datetime.now() + timedelta(days=730)).strftime("%Y-%m-%d")
    
    print(f"\n1. Fetching Climate Projections (Berlin) {start_date} to {end_date}...")
    try:
        projection = sdk.climate.get_projections(
            lat=52.52, 
            lon=13.41,
            start_date=start_date,
            end_date=end_date
        )
        print(f"✅ Success! Data points: {len(projection.daily.time)}")
        
        summary = sdk.climate.get_summary(projection)
        print(f"   Avg Temp: {summary.temperature.average}°C")
        print(f"   Projected Change: {summary.temperature.projected_change}°C ({summary.temperature.trend})")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()
    
    sdk.close()

if __name__ == "__main__":
    main()
