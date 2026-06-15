import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Dashboard from "./components/Dashboard";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {

  
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

  }, [darkMode]);

  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Hero />
      <Services />
      <Dashboard />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default App;