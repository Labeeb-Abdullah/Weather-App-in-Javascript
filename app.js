const weatherText = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  80: "Rain Showers",
  81: "Heavy Rain Showers",
  82: "Violent Rain Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Severe Thunderstorm with Hail",
};

const searchBtn = document.querySelector("#searchBtn");
const searchBar = document.querySelector("#searchBar");

async function getWeather(cityName) {
  if (!cityName || cityName.trim() === "") {
    alert("Please enter a city name.");
    return;
  }

  cityName = cityName.trim();

  try {
    localStorage.setItem("city", cityName);

    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName,
    )}&count=1`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    cityName = geoData.results[0].name;

    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max` +
      `&forecast_days=7`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();
    document.querySelector("#city").innerText = cityName;
    document.querySelector("#degree").innerText =
      weatherData.current.temperature_2m + "°C";
    document.querySelector("#feelslike").innerText =
      "Feels like " + weatherData.current.apparent_temperature + "°C";
    document.querySelector("#wind").innerText =
      "Wind: " + weatherData.current.wind_speed_10m + " km/h";
    document.querySelector("#humidity").innerText =
      "Humidity: " + weatherData.current.relative_humidity_2m + "%";

    const cards = document.querySelectorAll(".card");

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const code = weatherData.daily.weather_code[i];

      card.querySelector(".card-title").innerText = weatherData.daily.time[i];

      card.querySelector(".temperature").innerText =
        weatherData.daily.apparent_temperature_max[i] + "°";

      card.querySelector(".variation").innerText =
        weatherData.daily.temperature_2m_min[i] +
        "° / " +
        weatherData.daily.temperature_2m_max[i] +
        "°";

      if ([0, 1].includes(code)) {
        card.querySelector(".weather-emoji").innerText = "☀️";
      } else if ([2, 3, 45, 48].includes(code)) {
        card.querySelector(".weather-emoji").innerText = "☁️";
      } else if (
        [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)
      ) {
        card.querySelector(".weather-emoji").innerText = "🌧️";
      } else if ([71, 73, 75].includes(code)) {
        card.querySelector(".weather-emoji").innerText = "❄️";
      } else {
        card.querySelector(".weather-emoji").innerText = "🌤️";
      }

      card.querySelector(".oneliner").innerText =
        weatherText[code] || "Weather";
    }

    const temp = weatherData.current.temperature_2m;

    if (temp <= 10) {
      document.body.className = "bg-cold";
    } else if (temp <= 22) {
      document.body.className = "bg-mild";
    } else if (temp <= 33) {
      document.body.className = "bg-warm";
    } else {
      document.body.className = "bg-hot";
    }

    searchBar.value = "";
  } catch (error) {
    console.error(error);
    alert("Unable to fetch weather data.");
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchBar.value.trim();

  if (city !== "") {
    getWeather(city);
  }
});

searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("city");

  if (savedCity) {
    getWeather(savedCity);
  }
});
