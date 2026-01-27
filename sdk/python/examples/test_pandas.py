import sys
import os
import asyncio

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

try:
    import pandas as pd
    print("Pandas is available. proceeding with test.")
except ImportError:
    print("Pandas not installed. Please install pandas to run this test.")
    sys.exit(0)

async def main():
    print("Testing Adiyogi Weather SDK (Pandas Integration)...")
    
    sdk = WeatherSDK()
    
    # 1. Weather DataFrame
    print("\n1. Weather Forecast DataFrame")
    weather = await sdk.weather.get_forecast_async(51.5, -0.1)
    if weather.hourly:
        df = weather.hourly.to_dataframe()
        print(f"   DataFrame Shape: {df.shape}")
        print(f"   Columns: {df.columns.tolist()}")
        print(f"\nHEAD:\n{df.head(3)}")
    
    # 2. Climate DataFrame
    print("\n2. Climate Projections DataFrame")
    climate = await sdk.climate.get_projections_async(
        52.5, 13.4, 
        "2050-01-01", "2050-12-31"
    )
    if climate.daily:
        df_climate = climate.daily.to_dataframe()
        print(f"   DataFrame Shape: {df_climate.shape}")
        print(f"   Mean Temp (2050): {df_climate['temperature_2m_mean'].mean():.2f}")

    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
