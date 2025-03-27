import React, { useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme; // Apply theme
  };

  return <div className="btn-toggle-theme" onClick={toggleTheme}></div>;
};

export default ThemeToggle;
