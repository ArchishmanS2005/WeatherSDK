import sys
import os
import asyncio
import pandas as pd

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

async def main():
    print("Testing Adiyogi Weather SDK (Historical Forecast)...")
    
    sdk = WeatherSDK()
    
    # 1. Historical Forecast (Past Prediction)
    print("\n1. Historical Forecast (Berlin, Jan 1st 2024)")
    try:
        # Fetching what the forecast WAS for Jan 1st 2024
        hist_forecast = await sdk.historical_forecast.get_forecast_async(
            52.52, 13.41,
            "2024-01-01", "2024-01-02"
        )
        if hist_forecast.hourly:
            print(f"   Timepoints: {len(hist_forecast.hourly.time)}")
            df = hist_forecast.hourly.to_dataframe()
            print(f"   Shape: {df.shape}")
            print(f"   Forecasted Temp (First Hour): {df['temperature_2m'].iloc[0]}°C")
            
    except Exception as e:
        print(f"❌ Historical Forecast Failed: {e}")
        import traceback
        traceback.print_exc()

    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
