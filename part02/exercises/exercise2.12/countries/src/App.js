import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const CountryList = ({ countries }) => {
  const [countryName, setCountryName] = useState('');

  const countryList = countries.map((country) => (
    <div key={country.name}>
      {country.name}
      <button onClick={(event) => setCountryName(country.name)}>Show</button>
    </div>
  ));

  if (!countryName) {
    return <div>{countryList}</div>;
  } 

  return <Country country={countries.filter(c => c.name === countryName)[0]} />;
};

const Languages = ({ country }) => {
  if (!country || !country.languages) {
    return null;
  }

  return (
    <div>
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.iso639_1}>{language.name}</li>
        ))}
      </ul>
    </div>
  );
};

const Weather = ({ capital }) => {
  const apiKey = process.env.REACT_APP_API_KEY; 
  const weatherUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${capital}&units=m`;

  const [temperature, setTemperature] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    axios.get(weatherUrl).then((response) => {
      const currentWeather = response?.data?.current;
      setTemperature(currentWeather.temperature);
      setWindSpeed(currentWeather.wind_speed);
      setWindDirection(currentWeather.wind_dir);
      setIconUrl(currentWeather.weather_icons[0]);
    });
  }, []);

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div><b>temperature: </b> {temperature} Celsius</div>
      <div><img src={iconUrl} alt="" /></div>
      <div><b>wind: </b> {windSpeed} kmh direction {windDirection}</div>
    </div>
  );
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <Languages country={country} />
      <img src={country.flag} width="200" height="100" alt="" />
      <Weather capital={country.capital} />
    </div>  
  );
};

const Countries = ({countries}) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  return <CountryList countries={countries} />;
};

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState([]);

  const handleTextChange = (event) => {
    event.preventDefault();
    const text = event.target.value;
    setSearchText(text);

    const countryUrl = `https://restcountries.com/v2/name/${text}`;

    axios.get(countryUrl).then((response) => {
      if (response.data) {
        const countries = response.data;
        setCountries(countries);
      }
    });
    // TODO: what to do on error?
  };

  return (
    <div>
      <span>find countries </span>
      <input type="text" onChange={handleTextChange} value={searchText} />
      <Countries countries={countries} />
    </div>
  );
};

export default App;
