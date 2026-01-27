import sys
import os
import asyncio
import pandas as pd

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

async def main():
    print("Testing Final Services (Seasonal & Historical Air Quality)...")
    
    sdk = WeatherSDK()
    
    # 1. Seasonal
    print("\n1. Seasonal Forecast (Berlin)")
    try:
        seasonal = await sdk.seasonal.get_forecast_async(52.52, 13.41)
        if seasonal.daily:
            print(f"   Timepoints: {len(seasonal.daily.time)}")
            df = seasonal.daily.to_dataframe()
            print(f"   Shape: {df.shape}")
            print(f"   Max Temp (First Day): {df['temperature_2m_max'].iloc[0]}°C")
    except Exception as e:
        print(f"❌ Seasonal Failed: {e}")

    # 2. Historical Air Quality
    print("\n2. Historical Air Quality (New Delhi, Jan 2023)")
    try:
        # New Delhi coordinates
        aq = await sdk.air_quality.get_historical_async(
            28.61, 77.20,
            "2023-01-01", "2023-01-05"
        )
        if aq.hourly:
            print(f"   Timepoints: {len(aq.hourly.time)}")
            df_aq = aq.hourly.to_dataframe()
            print(f"   Mean PM2.5: {df_aq['pm2_5'].mean():.2f}")
    except Exception as e:
        print(f"❌ Historical AQ Failed: {e}")

    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
