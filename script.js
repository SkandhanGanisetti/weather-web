const apiKey = "33f7d7f1894cb836fb978af276e95553";

// Manual City Input
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchAndShowWeather(url);
}

// Auto-Detect User Location
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetchAndShowWeather(url);
    });
  }
};

// Voice Input for City Name
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("🎤 Voice recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const citySpoken = event.results[0][0].transcript;
    document.getElementById("cityInput").value = citySpoken;
    getWeather(); // Fetch weather for spoken city
  };

  recognition.onerror = function () {
    alert("❌ Error recognizing speech. Try again.");
  };
}

// Common Fetch + Display Function
async function fetchAndShowWeather(url) {
  const resultDiv = document.getElementById("weatherResult");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    showWeather(data);
  } catch (error) {
    resultDiv.innerHTML = "❌ City not found or network error.";
    resultDiv.classList.add("show");
  }
}

// Display Weather + Change Background
function showWeather(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p>🌡 Temperature: ${temp}°C</p>
    <p>🌤 Weather: ${desc}</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>🌬 Wind Speed: ${wind} m/s</p>
  `;
  resultDiv.classList.add("show");

  // Background change based on weather type
  const weatherType = data.weather[0].main.toLowerCase();
  const body = document.body;

  if (weatherType.includes("cloud")) {
    body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
  } else if (weatherType.includes("rain")) {
    body.style.background = "linear-gradient(to right, #000046, #1cb5e0)";
  } else if (weatherType.includes("clear")) {
    body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)";
  } else if (weatherType.includes("snow")) {
    body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
  } else {
    body.style.background = "linear-gradient(to right, #667eea, #764ba2)";
  }
}
