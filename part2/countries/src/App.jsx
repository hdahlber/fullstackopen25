import React, { useState, useEffect } from 'react'
import countriesService from "./services/countries"
import Countries from "./components/Countries"

function App() {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countriesService.getAll().then(initialCountries => {
      setCountries(initialCountries);
    });
  }, []);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setFilter(searchValue)

    setCountriesToShow(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchValue.toLowerCase())
      )
    )
  }

  return (
    <div>
      <h1>Country Data</h1>
      <div>
        Find countries <input value={filter} onChange={handleSearchChange} />
      </div>

      {countriesToShow.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : (
        <Countries
          countriesToShow={countriesToShow}
          setCountriesToShow={setCountriesToShow}
        />
      )}
    </div>
  )
}

export default App;

