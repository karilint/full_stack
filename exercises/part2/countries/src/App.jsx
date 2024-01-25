import React, { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries data: ', error));
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    handleWeatherSelect(country.capital);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleWeatherSelect = (city) => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          setSelectedWeather({
            temperature: data.main.temp,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            iconLink: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          });        
        } else {
          console.error('Error fetching weather data: ', data.message);
          setSelectedWeather(null);
        }
      })
      .catch(error => console.error('Error fetching weather data: ', error));
  };
  
  return (
    <div className="App">
      <h1>Countries List</h1>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.official}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.official}`} style={{ width: '150px' }} />

          {selectedWeather ? (
            <div>
              <h2>Weather in {selectedCountry.capital}</h2>
              <p>Temperature: {selectedWeather.temperature} °C</p>
              <p>Wind: {selectedWeather.windSpeed} m/s</p>
              <img src={selectedWeather.iconLink} alt={`Weather of ${selectedCountry.capital}`} style={{ width: '150px' }} />
            </div>
          ) : (
            <p>Weather data not available.</p>
          )}

          <button onClick={() => setSelectedCountry(null)}>Back to list</button>
        </div>
      ) : filteredCountries.length > 10 ? (
        <p>Please make your query more specific.</p>
      ) : (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.name.official}>
              {country.name.official}
              <button onClick={() => handleCountrySelect(country)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
