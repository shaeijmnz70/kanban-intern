import './client.css'

const medicines = [
  ['Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 'In Stock'],
  ['Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', 'In Stock'],
  ['Vitamin C 100mg', 'Ascorbic Acid', 'Vitamin', 'In Stock'],
  ['Omeprazole 20mg', 'Omeprazole', 'Antiulcer', 'Low Stock'],
  ['Cetirizine 10mg', 'Cetirizine', 'Antihistamine', 'In Stock'],
]

const shortcuts = [
  ['💊', 'Search Medicines', 'Check availability', 'blue'],
  ['▤', 'My Prescriptions', 'View your prescriptions', 'green'],
  ['♟', 'Alerts', 'Check notifications', 'purple'],
  ['●', 'Medicine Info', 'Learn more', 'orange'],
]

function Brand() {
  return (
    <div className="client-brand">
      <strong>✚</strong>
      <b>MedTrack</b>
      <small>Pharmacy Inventory<br />Management System</small>
    </div>
  )
}

function ClientDashboard() {
  return (
    <main className="client-app">
      <aside className="client-sidebar">
        <Brand />
        <nav aria-label="Client navigation">
          <a className="current" href="#/client"><span>◆</span> Home</a>
          <a href="#medicines"><span>💊</span> My Medicines</a>
          <a href="#medicine-info"><span>●</span> Medicine Info</a>
          <a href="#notifications"><span>♟</span> Notifications <b className="notification-count">2</b></a>
          <a href="#about"><span>●</span> About</a>
          <a href="#contact"><span>✉</span> Contact</a>
        </nav>
        <div className="help-card"><b>♧</b><strong>Need Help?</strong><small>Contact our support team</small><a href="#contact">Get Help</a></div>
        <div className="sidebar-wave" aria-hidden="true">⌁　〰</div>
      </aside>

      <section className="client-main">
        <header className="client-topbar">
          <label className="global-search"><span>⌕</span><input placeholder="Search for medicines..." /></label>
          <div className="client-account"><button className="bell" aria-label="Notifications">♧<i>2</i></button><span className="profile-avatar">👩🏻</span><span><b>Maria Santos</b><small>Client</small></span><button aria-label="Account menu">⌄</button></div>
        </header>

        <section className="welcome-banner">
          <div><h1>Welcome back, Maria!</h1><p>Find the medicines you need and<br />stay informed about your prescriptions.</p><a href="#medicines">Explore Medicines　➜</a></div>
          <div className="banner-pulse" aria-hidden="true">♡<span>⌁∿⌁</span></div>
        </section>

        <section className="client-shortcuts" aria-label="Quick links">
          {shortcuts.map(([icon, title, detail, color]) => <a className={`shortcut ${color}`} href={`#${title.toLowerCase().replaceAll(' ', '-')}`} key={title}><b>{icon}</b><span><strong>{title}</strong><small>{detail}</small></span><i>›</i></a>)}
        </section>

        <div className="client-content-grid">
          <section className="medicine-card" id="medicines">
            <header><h2><span>◇</span> Available Medicines</h2><a href="#medicines">View All　➜</a></header>
            <div className="medicine-filters"><label><span>⌕</span><input placeholder="Search medicine..." /></label><select defaultValue="all" aria-label="Filter by category"><option value="all">All Categories</option><option>Analgesic</option><option>Antibiotic</option></select></div>
            <div className="medicine-table-wrap"><table><thead><tr><th>Medicine Name</th><th>Generic Name</th><th>Category</th><th>Status</th><th></th></tr></thead><tbody>{medicines.map(([name, generic, category, status]) => <tr key={name}><td>{name}</td><td>{generic}</td><td>{category}</td><td><span className={`stock-status ${status === 'Low Stock' ? 'low' : ''}`}>{status}</span></td><td className="row-arrow">›</td></tr>)}</tbody></table></div>
          </section>

          <aside className="client-side-cards">
            <section className="reminder-card" id="notifications"><header><h2>▦　Your Medicine Reminders</h2><a href="#notifications">View All　➜</a></header><div className="empty-reminders"><b>▦</b><span>◷</span><strong>No upcoming reminders</strong><small>You&apos;re all caught up!</small></div></section>
            <section className="health-card" id="medicine-info"><header><h2>♧　Health Tips</h2><a href="#medicine-info">Read More ➜</a></header><div className="tip"><div className="pill-heart">💊<br />♡</div><p><strong>Take your medicine as prescribed.</strong><small>Proper medication helps you recover faster and stay healthy.</small></p></div></section>
          </aside>
        </div>

        <footer className="health-commitment" id="about">
          <h2>Our Commitment<br />to Your Health</h2><div><b>⬟</b><span><strong>Safe &amp; Reliable</strong><small>Accurate inventory for your safety.</small></span></div><div><b>♥</b><span><strong>Better Care</strong><small>Always here for your health.</small></span></div><div><b>♟</b><span><strong>A Healthier Community</strong><small>Together for a healthier tomorrow.</small></span></div>
        </footer>
      </section>
    </main>
  )
}

export default ClientDashboard