"use client";

import { useState } from "react";
import { Activity, ArrowRight, ArrowUpRight, Bell, BookOpen, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleHelp, Code2, Compass, FileText, Flag, Gauge, GitBranch, LayoutDashboard, Menu, MessageSquareText, MoreHorizontal, Network, Rocket, ShieldCheck, Sparkles, Target, TrendingUp, Users, X } from "lucide-react";

const milestones = [
  { title: "System design & architecture", desc: "Define your platform boundaries, data model, and cloud architecture.", date: "NOV 01 – NOV 14", icon: <Compass />, state: "done", status: "Completed" },
  { title: "Full stack implementation", desc: "Ship a working product with thoughtful UX and tested API contracts.", date: "NOV 15 – DEC 12", icon: <Code2 />, state: "current", status: "In progress" },
  { title: "DevOps & security foundation", desc: "Automate delivery, harden the app, and document your controls.", date: "DEC 13 – JAN 09", icon: <ShieldCheck />, state: "next", status: "Up next" },
  { title: "Observability & optimization", desc: "Measure reliability and improve the experience with evidence.", date: "JAN 10 – FEB 06", icon: <Activity />, state: "next", status: "Planned" },
  { title: "Career launch & networking", desc: "Present your work, practice interviews, and build your network.", date: "FEB 07 – APR 30", icon: <Rocket />, state: "next", status: "Planned" },
];

const navGroups = [
  { label: "Workspace", items: [{ name: "Overview", icon: <LayoutDashboard /> }, { name: "Roadmap", icon: <Flag /> }, { name: "Projects", icon: <BriefcaseBusiness /> }, { name: "Learning", icon: <BookOpen /> }] },
  { label: "Career", items: [{ name: "Portfolio", icon: <FileText /> }, { name: "Interview prep", icon: <MessageSquareText /> }, { name: "Network", icon: <Network /> }] },
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div>launchpad</div>
      <div className="workspace"><div className="avatar">AK</div><div><div className="workspace-name">Akash's workspace</div><div className="workspace-sub">Personal career plan</div></div><ChevronDown size={14} color="#89938c" /></div>
      {navGroups.map(group => <div key={group.label}><div className="nav-label">{group.label}</div><div className="nav">{group.items.map(item => <div key={item.name} className={`nav-item ${active === item.name ? "active" : ""}`} onClick={() => { setActive(item.name); if (item.name !== "Overview") notify(`${item.name} workspace is ready for your next session.`); }} role="button" tabIndex={0}>{item.icon}{item.name}</div>)}</div><div className="nav-spacer" /></div>)}
      <div className="sidebar-bottom"><div className="nav-label">Account</div><div className="nav-item" onClick={() => notify("Settings are coming soon.")}><Users />Settings</div><div className="help-card"><div className="help-title">A little progress adds up.</div><div className="help-copy">Keep your next step small and your momentum steady.</div><span className="help-link" onClick={() => notify("Your guide is ready.")}>Read the guide <ArrowUpRight size={12} /></span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div style={{display:"flex",alignItems:"center",gap:11}}><button className="icon-btn mobile-toggle" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={16}/> : <Menu size={16}/>}</button><div className="breadcrumb">Workspace <span style={{margin:"0 8px",color:"#c0c7c0"}}>/</span><strong>{active}</strong></div></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications" onClick={() => notify("You're all caught up.")}><Bell size={15}/><i className="dot"/></button><div className="avatar">AK</div></div></header>
      {menuOpen && <div style={{padding:"10px 16px",background:"white",borderBottom:"1px solid var(--line)"}}>{navGroups.flatMap(g => g.items).map(i => <button key={i.name} className="panel-link" onClick={() => {setActive(i.name);setMenuOpen(false)}} style={{padding:10,marginRight:8}}>{i.name}</button>)}</div>}
      <div className="page">
        <div className="eyebrow">Saturday, November 7, 2026 <span style={{margin:"0 7px",color:"#c1c9c2"}}>•</span> Week 1 of 26</div>
        <h1 className="page-heading">Good morning, Akash <span style={{fontSize:23}}>✳</span></h1>
        <p className="page-subtitle">You’re building something worth showing. Here’s your next step.</p>
        <section className="hero"><div className="hero-content"><span className="hero-tag"><Sparkles size={12}/> YOUR SIX-MONTH CAREER LAUNCH</span><h2>Build with intention. Launch with confidence.</h2><p>One focused plan for your product, your craft, and the career you’re working toward.</p><button className="hero-cta" onClick={() => {setActive("Roadmap");notify("Your roadmap is ready. Start with the architecture brief.")}}>Continue your roadmap <ArrowRight size={14}/></button></div><div className="hero-score"><div className="score-ring"><span className="score-number">68%</span></div><div className="score-label"><strong>Weekly focus</strong>On track this week<br/>3 of 4 sessions</div></div></section>
        <section className="stats">
          <article className="stat-card"><div className="stat-top">Roadmap progress <span className="stat-icon" style={{background:"#edf3e8",color:"#547756"}}><TrendingUp/></span></div><div className="stat-value">01<span style={{fontSize:14,color:"#77837b",fontWeight:600}}> / 26 weeks</span></div><div className="stat-foot"><span className="positive">Week one</span> of steady momentum</div></article>
          <article className="stat-card"><div className="stat-top">Skills in motion <span className="stat-icon" style={{background:"#f3eee7",color:"#92734d"}}><Target/></span></div><div className="stat-value">08</div><div className="stat-foot">Across <span className="positive">4 focus areas</span></div></article>
          <article className="stat-card"><div className="stat-top">Portfolio readiness <span className="stat-icon" style={{background:"#edf0f7",color:"#6879a0"}}><BriefcaseBusiness/></span></div><div className="stat-value">08<span style={{fontSize:14,color:"#77837b",fontWeight:600}}>%</span></div><div className="stat-foot"><span className="positive">Getting started</span> with your first case study</div></article>
          <article className="stat-card"><div className="stat-top">Next milestone <span className="stat-icon" style={{background:"#f7edeb",color:"#b77559"}}><Flag/></span></div><div className="stat-value" style={{fontSize:20}}>Nov 14</div><div className="stat-foot">Architecture brief <span className="positive">9 days left</span></div></article>
        </section>
        <section className="content-grid">
          <article className="panel"><div className="panel-head"><div className="panel-title">Your roadmap</div><button className="panel-link" onClick={() => {setActive("Roadmap");notify("Full roadmap opened.")}}>View full roadmap <ArrowRight size={12}/></button></div><div className="timeline">{milestones.map(m => <div className="milestone" key={m.title}><div className="milestone-icon">{m.icon}</div><div><div className="milestone-name">{m.title}</div><div className="milestone-desc">{m.desc}</div><span className={`pill ${m.state === "current" ? "current" : m.state === "done" ? "done" : ""}`}>{m.state === "done" && <Check size={10} style={{marginRight:4}}/>}{m.status}</span></div><div className="milestone-date">{m.date}</div></div>)}</div></article>
          <article className="panel"><div className="panel-head"><div className="panel-title">Skills in focus</div><button className="icon-btn" aria-label="More skill actions" onClick={() => notify("Skill details are up to date.")}><MoreHorizontal size={16}/></button></div>
            {[{n:"System design",p:72,i:<Gauge/>},{n:"Full stack development",p:58,i:<Code2/>},{n:"Cloud & DevOps",p:34,i:<GitBranch/>},{n:"Security fundamentals",p:26,i:<ShieldCheck/>}].map(s => <div key={s.n}><div className="skill-row"><div className="skill-icon">{s.i}</div><div className="skill-info"><div className="skill-name">{s.n}</div><div className="skill-meta">Building your foundation</div></div><div className="skill-pct">{s.p}%</div></div><div className="bar"><span style={{width:`${s.p}%`}}/></div></div>)}
            <div className="focus-box"><div className="focus-label">Your next focus</div><div className="focus-copy">Sketch the system boundaries for your capstone. Start with the user journey.</div><button className="panel-link" style={{padding:0,marginTop:8}} onClick={() => notify("System design brief opened.")}>Open project brief <ArrowRight size={12}/></button></div>
          </article>
        </section>
        <section className="bottom-grid">
          <article className="panel"><div className="panel-head"><div className="panel-title">Recent activity</div><button className="panel-link" onClick={() => notify("You’re viewing all activity.")}>See all</button></div>
            <div className="activity"><div className="activity-mark"><CheckCircle2/></div><div><div className="activity-text"><strong>Architecture goals</strong> added to your first milestone</div><div className="activity-time">Today at 9:42 AM</div></div></div>
            <div className="activity"><div className="activity-mark"><BookOpen/></div><div><div className="activity-text">Added <strong>system design reading</strong> to your learning plan</div><div className="activity-time">Yesterday at 4:18 PM</div></div></div>
            <div className="activity"><div className="activity-mark"><Target/></div><div><div className="activity-text"><strong>Weekly check-in</strong> logged · 3 focused sessions</div><div className="activity-time">Nov 6, 2026</div></div></div>
          </article>
          <article className="panel"><div className="panel-head"><div className="panel-title">A note for the journey</div><div className="stat-icon" style={{background:"#f4efe7",color:"#9a7952"}}><Sparkles/></div></div><p className="quote">“The secret of getting ahead is getting started.”</p><div className="quote-by">Mark Twain <span style={{color:"#c5cbc5",margin:"0 5px"}}>·</span> Keep it moving</div><div style={{height:18}}/><div className="resource-link" onClick={() => notify("Weekly review template opened.")}><strong>Open your weekly review</strong><ArrowUpRight/></div><div className="resource-link" onClick={() => notify("Learning library opened.")}><strong>Explore the learning library</strong><ArrowUpRight/></div></article>
        </section>
        <div style={{textAlign:"center",fontSize:10,color:"#a0a9a2",marginTop:23}}>Small steps. Strong systems. A career on your terms.</div>
      </div>
    </main>
    {toast && <div className="toast">{toast}</div>}
  </div>;
}
