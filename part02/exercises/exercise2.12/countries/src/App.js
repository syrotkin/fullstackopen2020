import React from "react";
import { useState } from "react";
import axios from "axios";

const CountryMessage = ({ count }) => {
  if (count > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  return null;
};

const CountryList = ({ countries }) => {
  const countryList = countries.map((country) => (
    <div key={country}>{country}</div>
  ));
  return <div>{countryList}</div>;
};

const Languages = ({ country }) => {
  if (!country || !country.languages) {
    return null;
  }

  return (
    <div>
      <h2>languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.iso639_1}>{language.name}</li>
        ))}
      </ul>
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
      <img src={country.flag} width="200" height="100"  />
    </div>
  );
};

const App = () => {
  const [searchText, setSearchText] = useState("");
  // TODO: you can only setCountries and do the logic in the specific components
  const [countryCount, setCountryCount] = useState(0);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);

  const handleTextChange = (event) => {
    event.preventDefault();
    const text = event.target.value;
    setSearchText(text);

    const countryUrl = `https://restcountries.eu/rest/v2/name/${text}`;

    axios.get(countryUrl).then((response) => {
      if (response.data) {
        const countries = response.data;
        console.log(countries);
        setCountryCount(countries.length);
        if (countries.length > 10) {
          setCountries([]);
          setCountry(null);
        } else if (countries.length <= 10 && countries.length > 1) {
          const countryNames = countries.map((c) => c.name);
          setCountries(countryNames);
          setCountry(null);
        } else if (countries.length === 1) {
          setCountries([]);
          setCountry(countries[0]);
          console.log(country);
        }
      }
    });
    // TODO: what to do on error?
  };

  return (
    <div>
      <span>find countries </span>
      <input type="text" onChange={handleTextChange} value={searchText} />
      <CountryMessage count={countryCount} />
      <CountryList countries={countries} />
      <Country country={country} />
    </div>
  );
};

export default App;
