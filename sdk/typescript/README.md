# Adiyogi Weather SDK (TypeScript)

[![npm version](https://img.shields.io/npm/v/@adiyogi/weather-sdk.svg)](https://www.npmjs.com/package/@adiyogi/weather-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A comprehensive, fully-typed TypeScript SDK for accessing high-precision weather, climate, and environmental data.

## 📦 Installation

```bash
npm install @adiyogi/weather-sdk
```

Or with yarn:
```bash
yarn add @adiyogi/weather-sdk
```

## 🚀 Quick Start

```typescript
import { AdiyogiClient } from '@adiyogi/weather-sdk';

const client = new AdiyogiClient({
  apiKey: process.env.ADIYOGI_API_KEY // Optional
});

// Get current weather
const weather = await client.weather.getCurrent({
  lat: 40.7128,
  lon: -74.0060
});

console.log(`Temperature: ${weather.temperature}°C`);
console.log(`Condition: ${weather.condition}`);
```

## 🌟 Features

- ✅ **Fully Typed** - Complete TypeScript definitions
- ✅ **Async/Await** - Modern promise-based API
- ✅ **Tree-shakable** - Import only what you need
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **Error Handling** - Comprehensive error types
- ✅ **Browser & Node.js** - Works everywhere

## 📚 Services

### Weather Forecast

```typescript
// Get 7-day forecast
const forecast = await client.weather.getForecast({
  lat: 52.52,
  lon: 13.41,
  days: 7,
  includeHourly: true
});

forecast.daily.forEach(day => {
  console.log(`${day.date}: ${day.temperature.max}°C`);
});
```

### Historical Data

```typescript
// Get historical weather data
const historical = await client.historical.getWeather({
  lat: 52.52,
  lon: 13.41,
  startDate: '2023-01-01',
  endDate: '2023-01-31',
  variables: ['temperature', 'precipitation']
});
```

### Air Quality

```typescript
// Get current air quality
const airQuality = await client.airQuality.getCurrent({
  lat: 28.61,
  lon: 77.20
});

console.log(`AQI: ${airQuality.aqi}`);
console.log(`PM2.5: ${airQuality.pm25}`);
```

### Marine Data

```typescript
// Get marine forecast
const marine = await client.marine.getForecast({
  lat: 35.6762,
  lon: 139.6503,
  days: 3
});

console.log(`Wave height: ${marine.waveHeight}m`);
```

### Elevation

```typescript
// Get elevation data
const elevation = await client.elevation.getElevation({
  lat: 47.5162,
  lon: 14.5501
});

console.log(`Elevation: ${elevation.altitude}m`);
```

### Geocoding

```typescript
// Search for locations
const results = await client.geocoding.search({
  query: 'London'
});

results.forEach(location => {
  console.log(`${location.name}, ${location.country}`);
});
```

## 🔧 Advanced Configuration

```typescript
const client = new AdiyogiClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.adiyogi.com',
  timeout: 10000,
  retries: 3,
  cache: true
});
```

## 🎯 React Hook

```typescript
import { useWeather } from '@adiyogi/weather-sdk/react';

function WeatherWidget() {
  const { data, loading, error } = useWeather({
    lat: 40.7128,
    lon: -74.0060,
    refreshInterval: 60000 // Refresh every minute
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h2>{data.temperature}°C</h2>
      <p>{data.condition}</p>
    </div>
  );
}
```

## 📖 API Reference

### Client Methods

- `client.weather.getCurrent(options)` - Current weather
- `client.weather.getForecast(options)` - Weather forecast
- `client.historical.getWeather(options)` - Historical data
- `client.airQuality.getCurrent(options)` - Air quality
- `client.marine.getForecast(options)` - Marine forecast
- `client.elevation.getElevation(options)` - Elevation data
- `client.geocoding.search(options)` - Location search
- `client.climate.getProjections(options)` - Climate projections
- `client.solar.getRadiation(options)` - Solar radiation

### TypeScript Types

```typescript
interface WeatherOptions {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial';
}

interface ForecastOptions extends WeatherOptions {
  days?: number;
  includeHourly?: boolean;
}

interface HistoricalOptions extends WeatherOptions {
  startDate: string;
  endDate: string;
  variables?: string[];
}
```

## ⚠️ Error Handling

```typescript
try {
  const weather = await client.weather.getCurrent({ lat: 40.7, lon: -74 });
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 🧪 Testing

```bash
npm test
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 🔗 Links

- [Documentation](https://docs.adiyogi.com)
- [GitHub](https://github.com/adiyogi/weather-sdk)
- [npm](https://www.npmjs.com/package/@adiyogi/weather-sdk)
- [Issues](https://github.com/adiyogi/weather-sdk/issues)

## 📞 Support

For support, email support@adiyogi.com or open an issue on GitHub.

