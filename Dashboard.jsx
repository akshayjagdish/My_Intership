import React from "react";

function Dashboard() {

  return (
    <section className="dashboard">

      <h2 className="section-title">
        Analytics Dashboard
      </h2>

      <div className="dashboard-grid">

        <div className="chart">

          <h3>Performance</h3>

          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="dashboard"
            width="100%"
          />

        </div>

        <div className="stats">

          <div className="stat-box">
            <h2>98%</h2>
            <p>Performance</p>
          </div>

          <div className="stat-box">
            <h2>100%</h2>
            <p>Accessibility</p>
          </div>

          <div className="stat-box">
            <h2>0.5s</h2>
            <p>Loading Time</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Dashboard;