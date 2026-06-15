import React from "react";

function Hero() {

  return (
    <section className="hero">

      <div className="hero-text">

        <h1>Modern React Website</h1>

        <p>
          Build responsive and interactive websites using React JS.
        </p>

        <button className="btn">Get Started</button>

      </div>

      <img
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
        alt="office"
      />

    </section>
  );
}

export default Hero;