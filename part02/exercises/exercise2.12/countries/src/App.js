import React from "react";
import { useState } from "react";
import axios from "axios";

const CountryList = ({ countries }) => {
  const countryList = countries.map((country) => (
    <div key={country.name}>{country.name}</div>
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
      <img src={country.flag} width="200" height="100" alt="" />
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

    const countryUrl = `https://restcountries.eu/rest/v2/name/${text}`;

    axios.get(countryUrl).then((response) => {
      if (response.data) {
        const countries = response.data;
        console.log(countries);
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
