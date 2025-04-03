import React, { useEffect, useState } from "react";
import moment from "moment-timezone"; // This gives you access to both Moment and Moment-Timezone
import "moment-timezone/data/packed/latest.json"; // This loads the timezone data
import { cities } from "../dep/settings.js"; // Import cities from the updated settings

const WorldTimeContainer = () => {
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const savedRegions = JSON.parse(localStorage.getItem("selectedRegions"));
    return savedRegions && savedRegions.length > 0 ? savedRegions : []; // No default cities here
  });

  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().startsWith(searchTerm.toLowerCase()) && // Predictive filtering
      !selectedRegions.includes(city.name) // Ensure not already selected
  );

  const updateTimes = () => {
    return selectedRegions
      .map((region) => {
        const city = cities.find((city) => city.name === region);
        if (!city) return null;

        const cityTime = moment().tz(city.timezone);

        return {
          name: city.name.toUpperCase(),
          time: {
            hours: cityTime.format("hh"),
            minutes: cityTime.format("mm"),
            period: cityTime.format("A"),
          },
          day: cityTime.format("dddd").toUpperCase(),
          date: cityTime.format("MMM D YYYY").toUpperCase(),
        };
      })
      .filter(Boolean);
  };

  const [times, setTimes] = useState(updateTimes);

  useEffect(() => {
    const interval = setInterval(() => setTimes(updateTimes()), 1000);
    return () => clearInterval(interval);
  }, [selectedRegions]);

  useEffect(() => {
    localStorage.setItem("selectedRegions", JSON.stringify(selectedRegions));
  }, [selectedRegions]);

  const addRegion = () => {
    if (selectedCity && !selectedRegions.includes(selectedCity)) {
      setSelectedRegions((prev) => {
        const updated = [...prev, selectedCity];
        localStorage.setItem("selectedRegions", JSON.stringify(updated));
        return updated;
      });
      setSelectedCity("");
      setSearchTerm("");
      setDropdownVisible(false); // Hide dropdown after selection
    }
  };

  const removeRegion = (region) => {
    setSelectedRegions((prev) => {
      const updated = prev.filter(
        (r) => r.toLowerCase() !== region.toLowerCase()
      );
      localStorage.setItem("selectedRegions", JSON.stringify(updated));
      return updated;
    });
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("selectedRegions");
    setSelectedRegions([]);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    setDropdownVisible(searchTerm.length > 0);

    // Predictive selection
    const matchingCity = filteredCities.find(
      (city) => city.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchingCity) {
      setSelectedCity(matchingCity.name);
      addRegion();
      setDropdownVisible(false);
    }
  };

  const selectCity = (cityName) => {
    setSelectedCity(cityName);
    addRegion();
    setDropdownVisible(false);
  };

  const clearInput = () => {
    setSearchTerm("");
    setSelectedCity("");
    setDropdownVisible(false);
  };

  return (
    <div id="world-time-container" className="container">
      {/* Control Group Always on Top */}
      <div className="control-group">
        <div className="input-group">
          <input
            type="text"
            id="city-search-bar"
            className="search-bar"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
          />
          {searchTerm && (
            <button className="clear-btn" onClick={clearInput}>
              ×
            </button>
          )}

          {/* Dropdown List (Replaces <select> element) */}
          {dropdownVisible && filteredCities.length > 0 && (
            <ul className="dropdown-list">
              {filteredCities.map((city, index) => (
                <li
                  key={`${city.name}-${index}`}
                  className="dropdown-item"
                  onClick={() => selectCity(city.name)}>
                  {city.name.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="button-group">
          <button className="add-btn" onClick={addRegion}>
            +
          </button>
          <button className="reset-btn" onClick={resetLocalStorage}>
            RESET
          </button>
        </div>
      </div>

      {/* Timezones Below */}
      <div className="timezones">
        {times.map((tz, index) => (
          <div key={index} className="timezone-card">
            <button className="close-btn" onClick={() => removeRegion(tz.name)}>
              ×
            </button>
            <div className="timezone-city">{tz.name}</div>
            <div className="timezone-time">
              {tz.time.hours}
              <span className="blinking-colon">:</span>
              {tz.time.minutes} {tz.time.period}
            </div>
            <div className="timezone-day">{tz.day}</div>
            <div className="timezone-date">{tz.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldTimeContainer;
