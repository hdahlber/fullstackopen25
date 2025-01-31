import { useEffect, useState } from "react"
import weatherService from "../services/weather"

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService.getWeather(capital).then((data) => {
      setWeather({
        temp: data.main.temp,
        wind: data.wind.speed,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    });
  }, [capital]);

  if (!weather) {
    return <div>Loading weather...</div>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>Temperature: {weather.temp}C</div>
      <img src={weather.iconUrl} alt="Weather icon" />
      <div>Wind: {weather.wind} m/s</div>
    </div>
  );
};

export default Weather;
