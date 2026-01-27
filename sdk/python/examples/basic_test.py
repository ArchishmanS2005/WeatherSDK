import sys
import os
import asyncio

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

def main():
    print("Testing Adiyogi Weather SDK...")
    
    sdk = WeatherSDK()
    
    # Test Sync
    print("\n1. Testing Sync Weather Fetch (New York)...")
    try:
        current = sdk.weather.get_current(lat=40.7128, lon=-74.0060)
        print(f"✅ Success! Temp: {current.current.temperature_2m}°C")
        print(f"   Timezone: {current.timezone}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        
    # Test Async
    print("\n2. Testing Async Weather Fetch (London)...")
    async def run_async():
        try:
            forecast = await sdk.weather.get_forecast_async(lat=51.5074, lon=-0.1278)
            print(f"✅ Success! 7-Day Forecast Max Temp: {forecast.daily.temperature_2m_max[0]}°C")
        except Exception as e:
            print(f"❌ Failed: {e}")
            
    asyncio.run(run_async())
    
    sdk.close()

if __name__ == "__main__":
    main()
