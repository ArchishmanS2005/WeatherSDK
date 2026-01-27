from typing import List
from .base import BaseService
from ..models.geocoding import GeocodingResponse, Location

class GeocodingService(BaseService):
    """Service for accessing the Open-Meteo Geocoding API"""
    
    BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
    
    def search(self, name: str, count: int = 10, language: str = "en") -> List[Location]:
        """
        Search for locations by name.
        
        Args:
            name: Location name
            count: Number of results (default: 10)
            language: Language code (default: "en")
            
        Returns:
            List of Location objects
        """
        params = {
            "name": name,
            "count": count,
            "language": language,
            "format": "json"
        }
        
        data = self._request("GET", self.BASE_URL, params=params)
        
        if "results" not in data:
            return []
            
        return [Location(**item) for item in data.get("results", [])]
        
    async def search_async(self, name: str, count: int = 10, language: str = "en") -> List[Location]:
        """Async version of search"""
        params = {
            "name": name,
            "count": count,
            "language": language,
            "format": "json"
        }
        
        data = await self._arequest("GET", self.BASE_URL, params=params)
        
        if "results" not in data:
            return []
            
        return [Location(**item) for item in data.get("results", [])]
