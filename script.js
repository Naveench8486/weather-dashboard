// Replace with your OpenWeatherMap API key
const API_KEY = "a53a36cca43e309011e6e1efef61476b";

// DOM Elements
const cityEl = document.getElementById("city");
const descEl = document.getElementById("description");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const iconEl = document.getElementById("icon");

// Chart instance variable
let tempChart;

// Get User Location
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    cityEl.textContent = "Geolocation not supported.";
  }
};

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeather(lat, lon);
}

function error() {
  cityEl.textContent = "Location access denied. Please enable location.";
}

async function fetchWeather(lat, lon) {
  try {
    // Current Weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    console.log("Weather Data:", weatherData); // 🔍 Debugging

    // Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();
    console.log("Forecast Data:", forecastData); // 🔍 Debugging

    if (weatherData.cod !== 200) throw new Error(weatherData.message);
    if (forecastData.cod !== "200") throw new Error(forecastData.message);

    displayWeather(weatherData);
    displayChart(forecastData);
  } catch (err) {
    cityEl.textContent = "Error fetching weather data: " + err.message;
    console.error("Weather API Error:", err);
  }
}

// Display Weather Info
function displayWeather(data) {
  cityEl.textContent = `${data.name}, ${data.sys.country}`;
  descEl.textContent = data.weather[0].description;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Display Chart
function displayChart(forecastData) {
  const labels = forecastData.list.slice(0, 7).map(item => {
    return new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const temps = forecastData.list.slice(0, 7).map(item => item.main.temp);

  const ctx = document.getElementById("tempChart").getContext("2d");

  if (tempChart) {
    tempChart.destroy(); // Prevent multiple charts
  }

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
