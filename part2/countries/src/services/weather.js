import axios from "axios";

const api_key = import.meta.env.VITE_API_KEY
const baseUrl = "https://api.openweathermap.org/data/2.5/weather"

const getWeather = (capital) => {
  const url = `${baseUrl}?q=${capital}&units=metric&APPID=${api_key}`
  return axios.get(url).then(response => response.data);
};

export default { getWeather }

