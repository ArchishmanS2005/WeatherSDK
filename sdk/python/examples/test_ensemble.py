import sys
import os
import asyncio
import pandas as pd

# Add sdk/python to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from adiyogi_weather import WeatherSDK

async def main():
    print("Testing Adiyogi Weather SDK (Ensemble)...")
    
    sdk = WeatherSDK()
    
    # 10. Ensemble
    print("\n10. Ensemble Forecast (Berlin)")
    try:
        ensemble = await sdk.ensemble.get_forecast_async(52.52, 13.41)
        print(f"    Timepoints: {len(ensemble.hourly.time)}")
        
        # Check for members
        members = [k for k in ensemble.hourly.model_dump().keys() if "member" in k]
        print(f"    Found {len(members)} ensemble members.")
        if members:
            val = getattr(ensemble.hourly, members[0])[0]
            print(f"    Member 01 (First Hour): {val}°C")
            
        # DataFrame Test
        df = ensemble.hourly.to_dataframe()
        print(f"    DataFrame Shape: {df.shape}")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()

    await sdk.aclose()

if __name__ == "__main__":
    asyncio.run(main())
