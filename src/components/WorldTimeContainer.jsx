import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import "moment-timezone/data/packed/latest.json";
import { cities } from "../dep/settings.js";

const WorldTimeContainer = () => {
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const savedRegions = JSON.parse(localStorage.getItem("selectedRegions"));
    return savedRegions && savedRegions.length > 0 ? savedRegions : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      !selectedRegions.includes(city.name)
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
    const selectedCity = localStorage.getItem("highlightedCity");
    if (selectedCity && !selectedRegions.includes(selectedCity)) {
      setSelectedRegions((prev) => {
        const updated = [...prev, selectedCity];
        localStorage.setItem("selectedRegions", JSON.stringify(updated));
        return updated;
      });
      localStorage.removeItem("highlightedCity"); // Clear the selected city after adding
      setSearchTerm("");
      setDropdownVisible(false);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    setDropdownVisible(searchTerm.length > 0);

    const matchingCity = filteredCities.find(
      (city) => city.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchingCity) {
      localStorage.setItem("highlightedCity", matchingCity.name);
      setSearchTerm("");
      setDropdownVisible(false);
      addRegion();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredCities.length - 1 ? prevIndex + 1 : prevIndex
      );
      localStorage.setItem(
        "highlightedCity",
        filteredCities[highlightedIndex + 1]?.name
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
      localStorage.setItem(
        "highlightedCity",
        filteredCities[highlightedIndex - 1]?.name
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      const selected = filteredCities[highlightedIndex];
      if (selected) {
        setSearchTerm("");
        setHighlightedIndex(-1);
        localStorage.setItem("highlightedCity", selected.name);
        addRegion();
        setDropdownVisible(false);
      }
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("selectedRegions");
    localStorage.removeItem("highlightedCity"); // Clear highlightedCity as well
    setSelectedRegions([]);
  };

  const removeRegion = (region) => {
    setSelectedRegions((prev) => {
      const updated = prev.filter(
        (r) => r.toLowerCase() !== region.toLowerCase()
      );
      localStorage.setItem("selectedRegions", JSON.stringify(updated));
      return updated;
    });
    localStorage.removeItem("highlightedCity"); // Clear highlightedCity when removing a region
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
            onFocus={() => setDropdownVisible(true)}
            onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}

          {/* Dropdown List */}
          {dropdownVisible && filteredCities.length > 0 && (
            <ul className="dropdown-list">
              {filteredCities.map((city, index) => (
                <li
                  key={`${city.name}-${index}`}
                  className={`dropdown-item ${
                    highlightedIndex === index ? "highlighted" : ""
                  }`}
                  onClick={() => {
                    localStorage.setItem("highlightedCity", city.name);
                    addRegion();
                    setDropdownVisible(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}>
                  {city.name.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="button-group">
          <button className="reset-btn" onClick={resetLocalStorage}>
            ⟳
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
