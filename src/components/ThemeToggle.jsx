import React, { useState, useEffect } from "react";

const themes = ["earth-theme", "dark-theme", "sunny-theme"];

const ThemeToggle = () => {
  // Check localStorage for saved theme, default to 'earth-theme' (index 0) if not found
  const savedThemeIndex = localStorage.getItem("themeIndex");
  const initialThemeIndex = savedThemeIndex ? parseInt(savedThemeIndex) : 0;

  const [currentThemeIndex, setCurrentThemeIndex] = useState(initialThemeIndex);

  const toggleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(nextThemeIndex);
    document.body.className = themes[nextThemeIndex]; // Apply theme

    // Store the new theme index in localStorage
    localStorage.setItem("themeIndex", nextThemeIndex);
  };

  // Apply the theme from localStorage when the component mounts
  useEffect(() => {
    document.body.className = themes[currentThemeIndex];
  }, [currentThemeIndex]);

  return (
    <div className="theme-toggle">
      <button className="burger-menu" onClick={toggleTheme}>
        ☰
      </button>
    </div>
  );
};

export default ThemeToggle;
