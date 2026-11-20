import { useEffect, useState } from 'react'
import './App.css'
import AuthPage from './login'

const features = [
  ['▥', 'Real-Time', 'Inventory Tracking'],
  ['⚠', 'Low Stock &', 'Expiry Alerts'],
  ['▤', 'Comprehensive', 'Reports'],
  ['♟', 'Multi-User', 'Access'],
  ['▣', 'Supplier', 'Management'],
]

const activities = [
  ['Paracetamol 500mg', 'Stock In · 1,000 pcs', '2h ago', 'teal'],
  ['Amoxicillin 500mg', 'Stock Out · 200 pcs', '3h ago', 'orange'],
  ['Vitamin C 100mg', 'Stock In · 500 pcs', '5h ago', 'blue'],
]

function Logo() {
  return (
    <div className="logo">
      <strong>✚</strong>
      <span><b>Med</b>Track<small>Pharmacy Inventory System</small></span>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="mockup">
      <aside>
        <div className="mock-logo">✚ MedTrack</div>
        {['⌂ Dashboard', '▤ Inventory', '↓ Stock In', '↑ Stock Out', '▧ Reports', '♟ Users', '▣ Suppliers', '⚙ Settings'].map((item, index) => (
          <div className={index === 0 ? 'side-item active' : 'side-item'} key={item}>{item}</div>
        ))}
      </aside>
      <section className="mock-content">
        <div className="mock-toolbar"><span>⌕ &nbsp; Search medicines...</span><b>●</b><i>JD</i></div>
        <h3>Dashboard</h3>
        <div className="stat-row">
          <div><em>◈</em><small>Total Medicines</small><b>5,320</b></div>
          <div><em className="green">✓</em><small>Available Stocks</small><b>4,720</b></div>
          <div><em className="amber">⚠</em><small>Low Stock</small><b>280</b></div>
          <div><em className="red">+</em><small>Out of Stock</small><b>120</b></div>
        </div>
        <div className="mock-panels">
          <div className="chart-panel"><b>Stock Overview</b><span className="legend">● Available　<span>●</span> Low Stock</span><div className="chart"><i /><i /></div><div className="days">Mon　 Tue　 Wed　 Thu　 Fri　 Sat　 Sun</div></div>
          <div className="activity-panel"><b>Recent Activities</b>{activities.map(([name, detail, time, color]) => <div className="activity" key={name}><i className={color}>●</i><span><b>{name}</b><small>{detail}</small></span><time>{time}</time></div>)}</div>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/login' || route === '#/register') {
    return <AuthPage mode={route === '#/register' ? 'register' : 'login'} />
  }

  return (
    <main className="site">
      <header className="header container">
        <Logo />
        <nav><a className="selected" href="#home">Home</a><a href="#features">Features</a><a href="#benefits">Benefits</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className="login" href="#/login">▣ Login</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy container"><p className="eyebrow">SMART PHARMACY MANAGEMENT</p><h1>Smart Pharmacy<br />Inventory Management<br />for a <span>Healthier Tomorrow</span></h1><p>Track, manage, and monitor your hospital&apos;s medicine inventory with ease, accuracy, and real-time insights.</p><div className="buttons"><a className="primary" href="#/register">Get Started　➜</a><a className="outline" href="#about">Learn More　▷</a></div></div>
        <div className="hero-photo"><img src="https://www.amnhealthcare.com/siteassets/amn-insights/news-and-features/pharmacists_role.jpg" alt="Pharmacist holding medicine in a pharmacy" /><div className="float-stats"><div>💊 <small>Total Medicines</small><b>5,320</b></div><div>✓ <small>Available Stocks</small><b>4,720</b></div><div>⚠ <small>Low Stock</small><b>280</b></div></div></div>
      </section>

      <section className="features container" id="features"><div className="section-title"><p className="eyebrow">KEY FEATURES</p><h2>Everything You Need in One System</h2><p>Streamline your pharmacy operations with powerful features.</p></div><div className="feature-grid">{features.map(([icon, title, detail]) => <article key={title}><b>{icon}</b><span>{title}<br />{detail}</span></article>)}</div></section>

      <section className="overview container" id="about"><DashboardMockup /><div className="overview-copy"><p className="eyebrow">REAL-TIME OVERVIEW</p><h2>Stay Informed,<br />Always</h2><p>Get a complete view of your pharmacy inventory — from stock levels to expiration alerts — all in one intuitive dashboard.</p><ul><li>Monitor stock availability</li><li>Track expiring medicines</li><li>Receive low-stock alerts</li></ul></div></section>

      <section className="benefits" id="benefits"><div className="section-title"><p className="eyebrow">WHY CHOOSE MEDTRACK?</p><h2>A Smarter Solution for Hospital Pharmacy</h2></div><div className="benefit-grid container">{[['♢', 'Improve Accuracy', 'Reduce human errors with automated tracking.'], ['◷', 'Save Time', 'Manage inventory faster and more efficiently.'], ['✚', 'Prevent Shortages', 'Ensure essential medicines are always available.'], ['♥', 'Enhance Patient Care', 'A well-stocked pharmacy for better healthcare.']].map(([icon, title, text]) => <article key={title}><b>{icon}</b><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="cta container"><b>〽</b><div><h2>Ready to Optimize Your Pharmacy Inventory?</h2><p>Join MedTrack today and experience smarter inventory management.</p></div><a className="primary" href="#contact">Get Started　➜</a></section>
      <footer className="footer container"><Logo /><div><a href="#home">Home</a><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a></div><b>●　▶　in</b><small>© 2025 MedTrack. All rights reserved.</small><small>Better Inventory. Healthier Community.</small></footer>
    </main>
  )
}

export default App
