# Adiyogi Weather SDK (TypeScript)

A comprehensive, fully-typed TypeScript SDK for the **Open-Meteo** ecosystem.
This repository contains the rigorous implementation of **all 12 Open-Meteo APIs**.

## 📦 Installation
```bash
npm install @adiyogi/weather-sdk
```

## 🚀 How To Use
Initialize the SDK once and use its specialized services.

```typescript
import { WeatherSDK } from '@adiyogi/weather-sdk';

const sdk = new WeatherSDK();

// 1. Forecast (Classic)
const forecast = await sdk.weather.getForecast(52.52, 13.41, {
  hourly: ['temperature_2m', 'rain']
});

// 2. Historical (Observations)
const history = await sdk.historical.getWeather(52.52, 13.41, {
  start_date: '2023-01-01',
  end_date: '2023-01-31',
  daily: ['temperature_2m_max']
});

// 3. Air Quality (Real-time & Historical)
const pollution = await sdk.airQuality.getCurrent(28.61, 77.20);
// OR fetch past data
const pastPollution = await sdk.airQuality.getHistorical(28.61, 77.20, '2022-01-01', '2022-01-05');
```

## 🛑 How NOT To Use (Common Pitfalls)

### 1. Don't confuse `Historical` vs `HistoricalForecast`
*   ❌ **Don't** use `historicalForecast` to get past weather.
*   ✅ **Use** `historical` (`archive-api`) for what *actually happened* (observations/reanalysis).
*   ✅ **Use** `historicalForecast` (`historical-forecast-api`) ONLY if you need to know what a model *predicted* in the past (e.g., verifying model accuracy).

### 2. Don't mix up `Solar` vs `Radiation`
*   ❌ **Don't** look for a "RadiationService".
*   ✅ **Use** `sdk.solar` for all radiation data (`shortwave_radiation`, `direct_normal_irradiance`).

### 3. Don't fetch everything at once
*   ❌ **Don't** request every variable if you don't need it. It slows down the response.
*   ✅ **Do** specify exactly which `hourly` or `daily` variables you need in the params object.

## 📚 Service Directory
| Service | property | Purpose |
|---------|----------|---------|
| Weather | `.weather` | General 16-day forecast |
| Historical | `.historical` | Past weather observations (1940+) |
| Marine | `.marine` | Wave height, direction, period |
| Air Quality | `.airQuality` | PM10, PM2.5, Ozone, Dust |
| Geocoding | `.geocoding` | Search "London", "Tokyo" |
| Elevation | `.elevation` | Get altitude for coordinates |
| Flood | `.flood` | River discharge & runoff |
| Climate | `.climate` | Long-term IPCC projections (2050+) |
| Solar | `.solar` | Solar energy & radiation |
| Ensemble | `.ensemble` | 30+ model probability distributions |
| Seasonal | `.seasonal` | 9-month long-range forecast |
| Historical Forecast | `.historicalForecast` | Past model runs (archives) |
