import httpx
from typing import Dict, Any, Optional
from ..exceptions import APIError, NetworkError, RateLimitError

class BaseService:
    """Base class for all weather services"""
    
    def __init__(self, sdk):
        self.sdk = sdk
        self.client = sdk._client
        self.async_client = sdk._async_client
        
    def _handle_error(self, response: httpx.Response) -> None:
        """Handle error responses from the API"""
        if response.is_success:
            return
            
        error_data = {}
        try:
            error_data = response.json()
        except:
            pass
            
        message = error_data.get("reason", error_data.get("error", "Unknown API Error"))
        
        if response.status_code == 429:
            raise RateLimitError("Rate limit exceeded", response.status_code, error_data)
        elif response.status_code >= 500:
            raise APIError(f"Server error: {message}", response.status_code, error_data)
        else:
            raise APIError(f"API request failed: {message}", response.status_code, error_data)

    def _request(self, method: str, url: str, **kwargs) -> Dict[str, Any]:
        """Make a synchronous request"""
        try:
            response = self.client.request(method, url, **kwargs)
            self._handle_error(response)
            return response.json()
        except httpx.RequestError as e:
            raise NetworkError(f"Network request failed: {str(e)}")

    async def _arequest(self, method: str, url: str, **kwargs) -> Dict[str, Any]:
        """Make an asynchronous request"""
        try:
            response = await self.async_client.request(method, url, **kwargs)
            self._handle_error(response)
            return response.json()
        except httpx.RequestError as e:
            raise NetworkError(f"Network request failed: {str(e)}")
