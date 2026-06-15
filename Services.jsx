import React from "react";

function Services() {

  const services = [
    "React Development",
    "UI/UX Design",
    "Performance",
    "SEO Optimization",
    "Responsive Design",
    "Accessibility"
  ];

  return (
    <section className="services">

      <h2 className="section-title">Services</h2>

      <div className="service-grid">

        {services.map((item, index) => (

          <div className="card" key={index}>

            <h3>{item}</h3>

            <p>
              Professional modern website solution.
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Services;