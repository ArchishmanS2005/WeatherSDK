from ..exceptions import InvalidCoordinatesError

def validate_coordinates(lat: float, lon: float) -> None:
    """
    Validate latitude and longitude values.
    
    Args:
        lat: Latitude (-90 to 90)
        lon: Longitude (-180 to 180)
        
    Raises:
        InvalidCoordinatesError: If coordinates are out of range
    """
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        raise InvalidCoordinatesError("Coordinates must be numbers")
        
    if not -90 <= lat <= 90:
        raise InvalidCoordinatesError(f"Latitude must be between -90 and 90, got {lat}")
        
    if not -180 <= lon <= 180:
        raise InvalidCoordinatesError(f"Longitude must be between -180 and 180, got {lon}")
