import React, { useState } from "react";

function Navbar({ darkMode, setDarkMode }) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="logo">TechSite</div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Dashboard</a>
        <a href="#">Team</a>
        <a href="#">Contact</a>

        <button
          className="btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

      </div>

      <div
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

    </nav>
  );
}

export default Navbar;