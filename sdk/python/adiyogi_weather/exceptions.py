class WeatherSDKError(Exception):
    """Base exception for all SDK errors"""
    pass

class APIError(WeatherSDKError):
    """Raised when the API returns an error response (4xx/5xx)"""
    def __init__(self, message: str, status_code: int = None, response: dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response

class NetworkError(WeatherSDKError):
    """Raised when a network error occurs (connection failed, timeout)"""
    pass

class InvalidCoordinatesError(WeatherSDKError):
    """Raised when invalid coordinates are provided"""
    pass

class RateLimitError(APIError):
    """Raised when API rate limit is exceeded"""
    pass

class ConfigurationError(WeatherSDKError):
    """Raised when SDK configuration is invalid"""
    pass
