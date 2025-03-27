import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import WorldTimeContainer from "./components/WorldTimeContainer";
import "./styles/reset.css";
import "./styles/style.css"; // Correct file name (not "styles.css")

const App = () => {
  return (
    <div className="container">
      <nav>
        <ThemeToggle />
      </nav>
      <WorldTimeContainer />
    </div>
  );
};

export default App;