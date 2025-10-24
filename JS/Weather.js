function openApp(url) {
  window.location.href = "/Iphone-Mock/HTML/home.html";
}
const url = "https://api.open-meteo.com/v1/forecast?latitude=41.57204&longitude=-73.58985&current_weather=true&temperature_unit=fahrenheit";
const cities = [
  { id: 'New-York', lat: 40.7128, lon: -74.0060 },
  { id: 'LA', lat: 34.0522, lon: -118.2437 },
  { id: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { id: 'Houston', lat: 29.7604, lon: -95.3698 },
  { id: 'Phoenix', lat: 33.4484, lon: -112.0740 },
  { id: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
  { id: 'San-Antonio', lat: 29.4241, lon: -98.4936 },
  { id: 'San-Diego', lat: 32.7157, lon: -117.1611 },
  { id: 'Dallas', lat: 32.7767, lon: -96.7970 },
  { id: 'San-Jose', lat: 37.3382, lon: -121.8863 },
  { id: 'Austin', lat: 30.2672, lon: -97.7431 },
  { id: 'Jacksonville', lat: 30.3322, lon: -81.6557 }
];


function fetchWeatherForCity(city) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&temperature_unit=fahrenheit`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      document.getElementById(`weather-temp-${city.id}`).textContent = `${temp}°F`;
    })
    .catch(err => console.error(`Error fetching weather for ${city.id}:`, err));
}

// Loop through all cities and fetch their weather
cities.forEach(city => fetchWeatherForCity(city));
