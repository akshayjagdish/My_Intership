import React from "react";

function Team() {

  const members = [
    "Developer",
    "Designer",
    "Manager",
    "SEO Expert"
  ];

  return (
    <section className="team">

      <h2 className="section-title">Our Team</h2>

      <div className="team-grid">

        {members.map((member, index) => (

          <div className="team-card" key={index}>

            <img
              src={`https://picsum.photos/300/300?random=${index}`}
              alt="team"
            />

            <h3>{member}</h3>

            <p>Professional Team Member</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Team;