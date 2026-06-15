const { useEffect, useMemo, useState } = React;

const defaultData = {
  services: [
    { title: "Web Development", icon: "fa-code", description: "Responsive React websites, dashboards, and business portals." },
    { title: "UI/UX Design", icon: "fa-pen-nib", description: "Conversion-focused layouts with clean interaction design." },
    { title: "API Integration", icon: "fa-plug", description: "Secure form handling, dashboard data, and workflow automation." },
    { title: "SEO Strategy", icon: "fa-magnifying-glass-chart", description: "Search-ready structure, metadata, schema, and performance." },
    { title: "Cloud Deployment", icon: "fa-cloud-arrow-up", description: "Deployment-ready frontend and backend architecture." },
    { title: "Accessibility", icon: "fa-universal-access", description: "WCAG-minded interfaces for keyboard and assistive technology users." }
  ],
  metrics: [
    { label: "Client retention", value: "94%" },
    { label: "Average launch", value: "21d" },
    { label: "Performance score", value: "98" },
    { label: "Projects shipped", value: "120+" }
  ],
  caseStudies: [
    { name: "FinEdge CRM", category: "SaaS Dashboard", result: "31% faster lead response", summary: "A role-based customer dashboard with analytics, task queues, and responsive data views." },
    { name: "UrbanKart", category: "Commerce", result: "42% higher checkout completion", summary: "A product discovery and checkout refresh with accessible forms and mobile-first flows." },
    { name: "HealthSync", category: "Operations", result: "18 hours saved weekly", summary: "A workflow portal that centralizes intake, reporting, and team coordination." }
  ],
  team: [
    { name: "Ayush Tirole", role: "Frontend Lead", image: "https://picsum.photos/420/420?random=21" },
    { name: "Pankaj Patil", role: "UX Strategist", image: "https://picsum.photos/420/420?random=22" },
    { name: "Akshay Dahibhate", role: "Backend Engineer", image: "https://picsum.photos/420/420?random=23" },
    { name: "Devesh Mahajan", role: "SEO Specialist", image: "https://picsum.photos/420/420?random=24" }
  ],
  testimonials: [
    { quote: "The new platform made our team faster from the first week.", author: "Priya Nair", company: "Nuvanta Labs" },
    { quote: "Clean design, strong accessibility, and a backend that just works.", author: "Karan Shah", company: "MetroCore" },
    { quote: "They translated a messy process into a polished customer experience.", author: "Maya Rao", company: "BrightDesk" }
  ],
  dashboard: {
    stats: [
      { label: "Active campaigns", value: "18", trend: "+12%" },
      { label: "Qualified leads", value: "2.4k", trend: "+24%" },
      { label: "Conversion rate", value: "7.8%", trend: "+9%" },
      { label: "Avg. response", value: "34m", trend: "-16%" }
    ],
    activity: ["Discovery workshop completed", "Accessibility audit passed", "API integration deployed", "Performance budget reviewed"]
  }
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "dashboard", label: "Dashboard" },
  { id: "contact", label: "Contact" }
];

function useHashRoute() {
  const getRoute = () => window.location.hash.replace("#", "") || "home";
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return [route, (nextRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
  }];
}

function Navbar({ route, setRoute, darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const goTo = (id) => {
    setRoute(id);
    setOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <button className="brand" onClick={() => goTo("home")} aria-label="TechSite home">
          <span className="brand-mark">T</span>
          <span>TechSite</span>
        </button>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-menu">
          <i className={`fa ${open ? "fa-xmark" : "fa-bars"}`}></i>
          <span className="sr-only">Toggle menu</span>
        </button>

        <div className={`nav-panel ${open ? "open" : ""}`} id="main-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={route === item.id ? "active" : ""}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}

          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            <i className={`fa ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </nav>
    </header>
  );
}

function PageShell({ eyebrow, title, text, children }) {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      {children}
    </>
  );
}

function Hero({ setRoute }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Business websites, dashboards, and APIs</p>
        <h1>Build a polished digital presence that can actually run your workflow.</h1>
        <p>
          TechSite combines responsive React interfaces, practical backend APIs,
          accessible forms, and measurable performance into one complete project.
        </p>
        <div className="button-row">
          <button className="primary-btn" onClick={() => setRoute("contact")}>Start a Project</button>
          <button className="secondary-btn" onClick={() => setRoute("work")}>View Work</button>
        </div>
      </div>
      <div className="hero-panel" aria-label="Project performance preview">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692"
          alt="Business team reviewing a web dashboard"
        />
        <div className="panel-dashboard">
          <div className="panel-top">
            <span></span><span></span><span></span>
          </div>
          <div className="chart-bars">
            {[44, 70, 58, 86, 76, 94].map((height, index) => <span key={index} style={{ height: `${height}%` }}></span>)}
          </div>
          <div className="insight-grid">
            <strong>98</strong>
            <span>Performance</span>
            <strong>AA</strong>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics({ metrics }) {
  return (
    <section className="metrics-grid" aria-label="Business metrics">
      {metrics.map((metric) => (
        <article key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </article>
      ))}
    </section>
  );
}

function ServicesGrid({ services }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h2>Everything needed for a production-ready business website.</h2>
      </div>
      <div className="card-grid">
        {services.map((service) => (
          <article className="feature-card" key={service.title}>
            <i className={`fa ${service.icon}`}></i>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = ["Discover", "Design", "Develop", "Integrate", "Test", "Deploy"];
  return (
    <section className="content-section process-section">
      <div className="section-heading">
        <p className="eyebrow">Process</p>
        <h2>A practical build path from idea to launch.</h2>
      </div>
      <div className="process-track">
        {steps.map((step, index) => (
          <article key={step}>
            <span>{index + 1}</span>
            <h3>{step}</h3>
            <p>{step === "Test" ? "Validate accessibility, responsiveness, forms, and API behavior." : "Move forward with clear deliverables and review points."}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CaseStudies({ caseStudies }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Case studies</p>
        <h2>Complex layouts with clear business outcomes.</h2>
      </div>
      <div className="case-grid">
        {caseStudies.map((study) => (
          <article className="case-card" key={study.name}>
            <span>{study.category}</span>
            <h3>{study.name}</h3>
            <p>{study.summary}</p>
            <strong>{study.result}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Starter", price: "$799", features: ["5 responsive pages", "Contact API", "Theme toggle"] },
    { name: "Growth", price: "$1,499", features: ["Advanced dashboard", "SEO setup", "Analytics-ready"] },
    { name: "Scale", price: "$2,499", features: ["Custom backend", "Workflow automation", "Deployment support"] }
  ];
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Plans</p>
        <h2>Packages for different business stages.</h2>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className="price-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            <ul>
              {plan.features.map((feature) => <li key={feature}><i className="fa fa-check"></i>{feature}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Team({ team }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Team</p>
        <h2>Specialists across frontend, backend, design, and growth.</h2>
      </div>
      <div className="team-grid">
        {team.map((member) => (
          <article className="team-card" key={member.name}>
            <img src={member.image} alt={`${member.name}, ${member.role}`} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Testimonials</p>
        <h2>Client feedback from recent launches.</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <figure className="quote-card" key={item.author}>
            <blockquote>{item.quote}</blockquote>
            <figcaption>{item.author}<span>{item.company}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ dashboard }) {
  return (
    <PageShell
      eyebrow="Live dashboard"
      title="Track project performance and business activity."
      text="This page demonstrates API-fed dashboard components, complex grids, and compact data presentation."
    >
      <section className="dashboard-layout">
        <div className="dashboard-stats">
          {dashboard.stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <em>{stat.trend}</em>
            </article>
          ))}
        </div>
        <article className="analytics-card">
          <h2>Campaign Performance</h2>
          <div className="line-chart" aria-label="Campaign performance chart">
            {[30, 55, 42, 76, 68, 88, 81].map((height, index) => <span key={index} style={{ height: `${height}%` }}></span>)}
          </div>
        </article>
        <article className="activity-card">
          <h2>Recent Activity</h2>
          <ul>
            {dashboard.activity.map((activity) => <li key={activity}><i className="fa fa-circle-check"></i>{activity}</li>)}
          </ul>
        </article>
      </section>
    </PageShell>
  );
}

function Faq() {
  const faqs = [
    ["Is this responsive?", "Yes. The layout adapts across mobile, tablet, laptop, and desktop breakpoints."],
    ["Does it include backend code?", "Yes. The Node backend serves static files, API content, health checks, and contact submissions."],
    ["Is accessibility considered?", "Yes. It includes semantic regions, skip links, focus styles, labels, contrast-conscious colors, and keyboard-friendly controls."]
  ];
  const [open, setOpen] = useState(0);

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>Common project questions.</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer], index) => (
          <article className="faq-item" key={question}>
            <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
              {question}
              <i className={`fa ${open === index ? "fa-minus" : "fa-plus"}`}></i>
            </button>
            {open === index && <p>{answer}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "Web Development", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email";
    if (form.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        setStatus(result.message || "Please review the form.");
        return;
      }
      setForm({ name: "", email: "", service: "Web Development", message: "" });
      setErrors({});
      setStatus(result.message);
    } catch (error) {
      setStatus("Backend is not running. Start the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-layout">
      <article className="contact-info">
        <p className="eyebrow">Contact</p>
        <h2>Tell us what you want to build.</h2>
        <p>Submit the form and the backend stores your message in <code>data/messages.json</code>.</p>
        <ul>
          <li><i className="fa fa-envelope"></i> akki08@techsite.local</li>
          <li><i className="fa fa-clock"></i> Mon-Fri, 9:00-18:00</li>
          <li><i className="fa fa-location-dot"></i> Remote-first delivery</li>
        </ul>
      </article>

      <form className="contact-form" onSubmit={submit} noValidate>
        <label>
          Name
          <input value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Service
          <select value={form.service} onChange={(event) => update("service", event.target.value)}>
            <option>Web Development</option>
            <option>UI/UX Design</option>
            <option>API Integration</option>
            <option>SEO Strategy</option>
          </select>
        </label>
        <label>
          Message
          <textarea rows="5" value={form.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)}></textarea>
          {errors.message && <span className="error">{errors.message}</span>}
        </label>
        <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
    </section>
  );
}

function Footer({ setRoute }) {
  return (
    <footer className="footer">
      <div>
        <strong>TechSite</strong>
        <p>Modern frontend, backend APIs, accessibility, and responsive design in one project.</p>
      </div>
      <div className="footer-links">
        {navItems.slice(1).map((item) => <button key={item.id} onClick={() => setRoute(item.id)}>{item.label}</button>)}
      </div>
    </footer>
  );
}

function HomePage({ data, setRoute }) {
  return (
    <>
      <Hero setRoute={setRoute} />
      <Metrics metrics={data.metrics} />
      <ServicesGrid services={data.services.slice(0, 3)} />
      <CaseStudies caseStudies={data.caseStudies} />
      <Testimonials testimonials={data.testimonials} />
    </>
  );
}

function App() {
  const [route, setRoute] = useHashRoute();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetch("/api/site-data")
      .then((response) => response.ok ? response.json() : defaultData)
      .then((apiData) => setData({ ...defaultData, ...apiData }))
      .catch(() => setData(defaultData));
  }, []);

  const page = useMemo(() => {
    if (route === "services") {
      return <><PageShell eyebrow="Services" title="Frontend, backend, and launch services." text="A complete service catalog using reusable React components, CSS Grid cards, and accessible content structure." /><ServicesGrid services={data.services} /><Process /><Pricing /></>;
    }
    if (route === "work") {
      return <><PageShell eyebrow="Work" title="Case studies built around measurable outcomes." text="Complex layouts for project summaries, result highlights, and client proof." /><CaseStudies caseStudies={data.caseStudies} /><Testimonials testimonials={data.testimonials} /></>;
    }
    if (route === "about") {
      return <><PageShell eyebrow="About" title="A focused team for polished business websites." text="This page demonstrates responsive team cards, FAQ accordions, semantic sections, and accessible controls." /><Team team={data.team} /><Faq /></>;
    }
    if (route === "dashboard") return <Dashboard dashboard={data.dashboard} />;
    if (route === "contact") return <><PageShell eyebrow="Contact" title="Start with a clear message." text="The form validates on the client and submits to the Node backend API." /><ContactForm /></>;
    return <HomePage data={data} setRoute={setRoute} />;
  }, [route, data]);

  return (
    <>
      <Navbar route={route} setRoute={setRoute} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main id="main-content">{page}</main>
      <Footer setRoute={setRoute} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
