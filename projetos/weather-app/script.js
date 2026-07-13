const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const details = document.querySelector("#details");
const message = document.querySelector("#message");

const weatherCodes = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa intensa",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  80: "Pancadas leves",
  81: "Pancadas moderadas",
  82: "Pancadas fortes",
  95: "Trovoada"
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) return;

  message.textContent = "Buscando clima...";
  cityName.textContent = "---";
  temperature.textContent = "--°C";
  description.textContent = "---";
  details.textContent = "Máx: --°C | Mín: --°C";

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      message.textContent = "Cidade não encontrada.";
      return;
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, country } = place;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    cityName.textContent = `${name}, ${country}`;
    temperature.textContent = `${weatherData.current.temperature_2m}°C`;
    description.textContent =
      weatherCodes[weatherData.current.weather_code] || "Clima indisponível";
    details.textContent = `Máx: ${weatherData.daily.temperature_2m_max[0]}°C | Mín: ${weatherData.daily.temperature_2m_min[0]}°C`;
    message.textContent = "";
  } catch (error) {
    message.textContent = "Erro ao buscar dados do clima.";
  }
});