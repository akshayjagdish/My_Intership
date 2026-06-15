import React, { useState } from "react";

function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {

    let newErrors = {};

    if (!form.name) {
      newErrors.name = "Name Required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Valid Email Required";
    }

    if (form.message.length < 10) {
      newErrors.message = "Message Too Short";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (e) => {

    e.preventDefault();

    if (validate()) {
      alert("Form Submitted");
    }
  };

  return (
    <section className="contact">

      <h2 className="section-title">Contact Us</h2>

      <form onSubmit={submitForm}>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <p className="error">{errors.name}</p>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <p className="error">{errors.email}</p>

        <textarea
          rows="5"
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        ></textarea>

        <p className="error">{errors.message}</p>

        <button className="btn">
          Send Message
        </button>

      </form>

    </section>
  );
}

export default Contact;