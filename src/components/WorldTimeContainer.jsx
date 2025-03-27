import React, { useEffect, useState } from "react";
import { offset, regions } from "../dep/settings.js";

const WorldTimeContainer = () => {
  const [selectedRegions, setSelectedRegions] = useState(() => {
    // Load saved regions from localStorage or default to some cities
    const savedRegions = JSON.parse(localStorage.getItem("selectedRegions"));
    return savedRegions && savedRegions.length > 0 ? savedRegions : ["New York", "London"];
  });

  const [selectedCity, setSelectedCity] = useState(""); // Store dropdown selection

  const updateTimes = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60000; // Convert local time to UTC
  
    return selectedRegions.map((region) => {
      const index = regions.indexOf(region);
      if (index === -1) return null; // Prevent errors for missing regions
  
      const offsetHours = parseInt(offset[index], 10);
      const timeZoneTime = new Date(utcNow + offsetHours * 3600 * 1000); // Apply offset to UTC time
  
      return {
        name: region.toUpperCase(),
        time: {
          hours: (timeZoneTime.getHours() % 12 || 12).toString().padStart(2, "0"),
          minutes: timeZoneTime.getMinutes().toString().padStart(2, "0"),
          period: timeZoneTime.getHours() >= 12 ? "PM" : "AM",
        },
        day: timeZoneTime.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        date: `${timeZoneTime.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} ${timeZoneTime.getDate()} ${timeZoneTime.getFullYear()}`,
      };
    }).filter(Boolean); // Remove any null values
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

  return (
    <div id="world-time-container">
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
        <select className="select-dropdown" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          <option value="" disabled>Select a city</option>
          {regions.map((region) =>
            !selectedRegions.includes(region) ? (
              <option key={region} value={region}>
                {region.toUpperCase()}
              </option>
            ) : null
          )}
        </select>
        <button className="add-btn" onClick={addRegion}>+</button>
      </div>
    </div>
  );
};

export default WorldTimeContainer;
