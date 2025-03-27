import React, { useEffect, useState } from "react";

import { cities } from "../dep/settings.js"; // Import cities from the updated settings

const WorldTimeContainer = () => {
  // State for storing selected regions and cities
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const savedRegions = JSON.parse(localStorage.getItem("selectedRegions"));
    return savedRegions && savedRegions.length > 0 ? savedRegions : []; // No default cities here
  });

  const [selectedCity, setSelectedCity] = useState(""); // Store dropdown selection
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term for filtering

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedRegions.includes(city.name)
  );

  const updateTimes = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60000; // Convert local time to UTC

    return selectedRegions.map((region) => {
      const city = cities.find((city) => city.name === region); // Find the city object from settings.js
      if (!city) return null; // Prevent errors for missing cities

      const offsetHours = parseFloat(city.offset);
      const timeZoneTime = new Date(utcNow + offsetHours * 3600 * 1000); // Apply offset to UTC time

      return {
        name: city.name.toUpperCase(),
        time: {
          hours: (timeZoneTime.getHours() % 12 || 12).toString().padStart(2, "0"),
          minutes: timeZoneTime.getMinutes().toString().padStart(2, "0"),
          period: timeZoneTime.getHours() >= 12 ? "PM" : "AM",
        },
        day: timeZoneTime.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        date: `${timeZoneTime.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} ${timeZoneTime.getDate()} ${timeZoneTime.getFullYear()}`,
      };
    }).filter(Boolean);
  };

  const [times, setTimes] = useState(updateTimes);

  // Update times every second
  useEffect(() => {
    const interval = setInterval(() => setTimes(updateTimes()), 1000);
    return () => clearInterval(interval);
  }, [selectedRegions]);

  // Save selected regions to localStorage when they change
  useEffect(() => {
    localStorage.setItem("selectedRegions", JSON.stringify(selectedRegions));
  }, [selectedRegions]);

  // Add a city
  const addRegion = () => {
    if (selectedCity && !selectedRegions.includes(selectedCity)) {
      setSelectedRegions((prev) => {
        const updated = [...prev, selectedCity];
        localStorage.setItem("selectedRegions", JSON.stringify(updated));
        return updated;
      });
      setSelectedCity(""); // Reset dropdown selection
    }
  };

  // Remove a city
  const removeRegion = (region) => {
    setSelectedRegions((prev) => {
      const updated = prev.filter((r) => r.toLowerCase() !== region.toLowerCase());
      localStorage.setItem("selectedRegions", JSON.stringify(updated));
      return updated;
    });
  };

  // Reset localStorage and selectedRegions
  const resetLocalStorage = () => {
    localStorage.removeItem("selectedRegions");
    setSelectedRegions([]); // Reset to an empty list
  };

  // Handle input change and check for full matches
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Check if there is a full match (case insensitive) and auto-select if so
    const matchingCity = filteredCities.find(
      (city) => city.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (matchingCity) {
      setSelectedCity(matchingCity.name);
      addRegion(); // Automatically add the city
    }
  };

  // Clear the input field when X button is clicked
  const clearInput = () => {
    setSearchTerm("");
    setSelectedCity(""); // Reset the selected city
  };

  return (
    <div id="world-time-container" className="container">
      <div className="timezones">
        {times.map((tz, index) => (
          <div key={index} className="timezone-card">
            <button className="close-btn" onClick={() => removeRegion(tz.name)}>×</button>
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

      {/* Add Region Button */}
      <div className="region-selector">
        <div className="input-group">
          {/* Search bar */}
          <input
            type="text"
            id="city-search-bar" // Unique ID for the search input
            className="search-bar"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={handleSearchChange} // Use the updated function
          />
          {/* Clear Button */}
          {searchTerm && (
            <button className="clear-btn" onClick={clearInput}>×</button> // Show the X button only if there is a search term
          )}

        <select
          id="city-dropdown" // Unique ID for the select dropdown
          className="select-dropdown"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="" disabled>Select a city</option>
          {filteredCities.map((city, index) => (
            <option
              key={`${city.name}-${index}`} // New key using the index
              value={city.name}
            >
              {city.name.toUpperCase()}
            </option>
          ))}
        </select>
        </div>

        <div className="button-group">
          <button className="add-btn" onClick={addRegion}>+</button>

          {/* Reset LocalStorage Button */}
          <button className="reset-btn" onClick={resetLocalStorage}>Reset Cities</button>
        </div>
      </div>
    </div>
  );
};

export default WorldTimeContainer;
