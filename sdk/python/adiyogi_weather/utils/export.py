from typing import Any, Dict

class PandasExportMixin:
    """Mixin to add to_dataframe support to Pydantic models"""
    
    def to_dataframe(self) -> Any:
        """
        Convert the model data to a Pandas DataFrame.
        Requires pandas to be installed.
        """
        try:
            import pandas as pd
        except ImportError:
            raise ImportError(
                "Pandas is required for this feature. "
                "Please install it with: pip install pandas"
            )
            
        data = self.model_dump()
        
        # Scenario 1: Time-series data (e.g. hourly/daily forecasts)
        # Look for 'time' list and other lists of matching length
        if "time" in data and isinstance(data["time"], list):
            time_len = len(data["time"])
            if time_len > 0:
                # Filter for list columns that match time length
                df_data = {
                    k: v for k, v in data.items() 
                    if isinstance(v, list) and len(v) == time_len
                }
                
                df = pd.DataFrame(df_data)
                
                # Convert time to datetime objects
                if "time" in df.columns:
                    try:
                        df["time"] = pd.to_datetime(df["time"])
                        df.set_index("time", inplace=True)
                    except:
                        pass
                        
                return df
                
        # Scenario 2: Single record or unrelated lists
        # Just convert the whole object to a single-row DataFrame
        # Flatten nested models if possible? For now, simple dump.
        return pd.DataFrame([data])
