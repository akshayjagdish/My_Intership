import React from "react";

function Testimonials() {

  return (
    <section className="testimonials">

      <h2 className="section-title">
        Testimonials
      </h2>

      <div className="testimonial-grid">

        <div className="card">
          <p>Amazing React Website.</p>
          <h4>- Client 1</h4>
        </div>

        <div className="card">
          <p>Excellent UI Design.</p>
          <h4>- Client 2</h4>
        </div>

        <div className="card">
          <p>Best Responsive Website.</p>
          <h4>- Client 3</h4>
        </div>

      </div>

    </section>
  );
}

export default Testimonials;