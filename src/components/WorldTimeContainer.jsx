import React, { useEffect, useState } from "react";
import { objQty, offset, isDST, regions } from "../dep/settings.js";

const WorldTimeContainer = () => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const updatedTimes = regions.map((region, index) => {
        const offsetHours = parseInt(offset[index], 10);
        const timeZoneTime = new Date(now.getTime() + offsetHours * 3600 * 1000);
        return {
          name: region,
          time: timeZoneTime.toLocaleTimeString(),
        };
      });

      setTimes(updatedTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="world-time-container">
      <div className="timezones">
        {times.map((tz, index) => (
          <div key={index} className="timezone-box">
            <h3>{tz.name}</h3>
            <p>{tz.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldTimeContainer;
