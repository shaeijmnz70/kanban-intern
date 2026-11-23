import { useState, type FormEvent } from 'react'
import './admin.css'

type PageId =
  | 'dashboard'
  | 'medicines'
  | 'inventory'
  | 'categories'
  | 'suppliers'
  | 'purchases'
  | 'expiration'
  | 'prescriptions'
  | 'patients'
  | 'user-management'
  | 'notifications'
  | 'reports'
  | 'audit-logs'
  | 'settings'

type DataRow = Record<string, string>
type Medicine = {
  code: string
  name: string
  generic: string
  category: string
  stock: string
  unitPrice: string
  status: string
}

const navigation: { heading: string; links: { id: PageId; icon: string; label: string }[] }[] = [
  { heading: 'OVERVIEW', links: [{ id: 'dashboard', icon: '▦', label: 'Dashboard' }] },
  { heading: 'PHARMACY', links: [
    { id: 'medicines', icon: '◈', label: 'Medicines' },
    { id: 'inventory', icon: '▤', label: 'Inventory' },
    { id: 'categories', icon: '▦', label: 'Categories' },
    { id: 'suppliers', icon: '▱', label: 'Suppliers' },
    { id: 'purchases', icon: '⇄', label: 'Purchases' },
    { id: 'expiration', icon: '◷', label: 'Expiration' },
  ] },
  { heading: 'CARE', links: [
    { id: 'prescriptions', icon: '▧', label: 'Prescriptions' },
    { id: 'patients', icon: '♙', label: 'Patients' },
    { id: 'user-management', icon: '♟', label: 'User Management' },
  ] },
  { heading: 'SYSTEM', links: [
    { id: 'notifications', icon: '♧', label: 'Notifications' },
    { id: 'reports', icon: '▥', label: 'Reports' },
    { id: 'audit-logs', icon: '◷', label: 'Audit Logs' },
    { id: 'settings', icon: '⚙', label: 'Settings' },
  ] },
]

const initialMedicines: Medicine[] = [
  { code: 'MED-1024', name: 'Biogesic 500mg', generic: 'Paracetamol', category: 'Analgesics', stock: '2,450', unitPrice: '₱2.50', status: 'In Stock' },
  { code: 'MED-1023', name: 'Amoxil 500mg', generic: 'Amoxicillin', category: 'Antibiotics', stock: '1,820', unitPrice: '₱12.00', status: 'In Stock' },
  { code: 'MED-1022', name: 'Losartan 50mg', generic: 'Losartan Potassium', category: 'Cardiovascular', stock: '48', unitPrice: '₱8.75', status: 'Low Stock' },
  { code: 'MED-1021', name: 'Cetirizine 10mg', generic: 'Cetirizine', category: 'Antihistamines', stock: '1,160', unitPrice: '₱3.25', status: 'In Stock' },
  { code: 'MED-1020', name: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'Gastrointestinal', stock: '0', unitPrice: '₱6.00', status: 'Out of Stock' },
]

const pageTables: Partial<Record<PageId, { description: string; action: string; columns: string[]; rows: DataRow[] }>> = {
  inventory: { description: 'Track stock levels, batches, and storage locations.', action: 'Stock In', columns: ['Batch ID', 'Medicine', 'Location', 'Available', 'Reorder Level', 'Status'], rows: [
    { 'Batch ID': 'BTH-2025-0812', Medicine: 'Biogesic 500mg', Location: 'Main Store · A-03', Available: '2,450 units', 'Reorder Level': '500 units', Status: 'In Stock' },
    { 'Batch ID': 'BTH-2025-0808', Medicine: 'Amoxil 500mg', Location: 'Main Store · B-01', Available: '1,820 units', 'Reorder Level': '300 units', Status: 'In Stock' },
    { 'Batch ID': 'BTH-2025-0724', Medicine: 'Losartan 50mg', Location: 'Dispensary · C-02', Available: '48 units', 'Reorder Level': '100 units', Status: 'Low Stock' },
  ] },
  categories: { description: 'Organize medicines into groups for easier tracking.', action: 'Add Category', columns: ['Category', 'Medicines', 'Description', 'Last Updated', 'Status'], rows: [
    { Category: 'Analgesics', Medicines: '186', Description: 'Pain relief and fever reducers', 'Last Updated': 'Feb 22, 2025', Status: 'Active' },
    { Category: 'Antibiotics', Medicines: '142', Description: 'Bacterial infection treatments', 'Last Updated': 'Feb 21, 2025', Status: 'Active' },
    { Category: 'Cardiovascular', Medicines: '98', Description: 'Heart and blood pressure care', 'Last Updated': 'Feb 19, 2025', Status: 'Active' },
  ] },
  suppliers: { description: 'Manage supplier details and their purchase history.', action: 'Add Supplier', columns: ['Supplier', 'Contact Person', 'Email', 'Products', 'Status'], rows: [
    { Supplier: 'MedSource Pharma Inc.', 'Contact Person': 'Liza Reyes', Email: 'l.reyes@medsource.ph', Products: '86 medicines', Status: 'Active' },
    { Supplier: 'WellCare Distributors', 'Contact Person': 'Marco Lim', Email: 'marco@wellcare.ph', Products: '54 medicines', Status: 'Active' },
    { Supplier: 'PrimeHealth Trading', 'Contact Person': 'Ana Cruz', Email: 'ana@primehealth.ph', Products: '32 medicines', Status: 'Pending' },
  ] },
  purchases: { description: 'Review purchase orders and incoming deliveries.', action: 'New Purchase', columns: ['Order ID', 'Supplier', 'Order Date', 'Items', 'Total', 'Status'], rows: [
    { 'Order ID': 'PO-2025-046', Supplier: 'MedSource Pharma Inc.', 'Order Date': 'Feb 24, 2025', Items: '14 items', Total: '₱84,260', Status: 'In Transit' },
    { 'Order ID': 'PO-2025-045', Supplier: 'WellCare Distributors', 'Order Date': 'Feb 22, 2025', Items: '8 items', Total: '₱36,480', Status: 'Received' },
    { 'Order ID': 'PO-2025-044', Supplier: 'PrimeHealth Trading', 'Order Date': 'Feb 20, 2025', Items: '11 items', Total: '₱52,900', Status: 'Pending' },
  ] },
  expiration: { description: 'Monitor medicine batches approaching their expiry date.', action: 'Export List', columns: ['Medicine', 'Batch Number', 'Quantity', 'Expiry Date', 'Days Left', 'Status'], rows: [
    { Medicine: 'Amoxil 500mg', 'Batch Number': 'AMX-2406', Quantity: '120 units', 'Expiry Date': 'Mar 18, 2025', 'Days Left': '22 days', Status: 'Expiring Soon' },
    { Medicine: 'Vitamin C 500mg', 'Batch Number': 'VTC-2408', Quantity: '340 units', 'Expiry Date': 'Apr 09, 2025', 'Days Left': '44 days', Status: 'Expiring Soon' },
    { Medicine: 'Cetirizine 10mg', 'Batch Number': 'CTZ-2410', Quantity: '85 units', 'Expiry Date': 'May 14, 2025', 'Days Left': '79 days', Status: 'Monitor' },
  ] },
  prescriptions: { description: 'Review and verify prescriptions submitted by patients.', action: 'Review Queue', columns: ['Prescription ID', 'Patient', 'Prescriber', 'Submitted', 'Items', 'Status'], rows: [
    { 'Prescription ID': 'RX-2025-1842', Patient: 'Maria Santos', Prescriber: 'Dr. Cruz', Submitted: '12 min ago', Items: '3 medicines', Status: 'Pending' },
    { 'Prescription ID': 'RX-2025-1841', Patient: 'Jose Reyes', Prescriber: 'Dr. Villanueva', Submitted: '35 min ago', Items: '2 medicines', Status: 'Verified' },
    { 'Prescription ID': 'RX-2025-1840', Patient: 'Lina Garcia', Prescriber: 'Dr. Lim', Submitted: '1 hr ago', Items: '1 medicine', Status: 'Verified' },
  ] },
  patients: { description: 'View patient accounts and their pharmacy activity.', action: 'Add Patient', columns: ['Patient', 'Patient ID', 'Email', 'Prescriptions', 'Last Activity', 'Status'], rows: [
    { Patient: 'Maria Santos', 'Patient ID': 'PAT-00824', Email: 'maria.santos@email.com', Prescriptions: '12', 'Last Activity': 'Today', Status: 'Active' },
    { Patient: 'Jose Reyes', 'Patient ID': 'PAT-00823', Email: 'jose.reyes@email.com', Prescriptions: '8', 'Last Activity': 'Yesterday', Status: 'Active' },
    { Patient: 'Lina Garcia', 'Patient ID': 'PAT-00822', Email: 'lina.garcia@email.com', Prescriptions: '5', 'Last Activity': 'Feb 21, 2025', Status: 'Active' },
  ] },
  'user-management': { description: 'Manage staff accounts, roles, and access permissions.', action: 'Invite User', columns: ['User', 'Role', 'Email', 'Last Active', 'Status'], rows: [
    { User: 'Angela Ramos', Role: 'Pharmacist', Email: 'angela.ramos@medtrack.ph', 'Last Active': 'Now', Status: 'Active' },
    { User: 'Roberto Cruz', Role: 'Inventory Staff', Email: 'roberto.cruz@medtrack.ph', 'Last Active': '18 min ago', Status: 'Active' },
    { User: 'Sofia Admin', Role: 'Super Admin', Email: 'sofia.admin@medtrack.ph', 'Last Active': 'Now', Status: 'Active' },
  ] },
  notifications: { description: 'Important alerts and updates from across your pharmacy.', action: 'Mark all read', columns: ['Notification', 'Type', 'Date', 'Priority', 'Status'], rows: [
    { Notification: 'Losartan 50mg is below reorder level', Type: 'Low stock', Date: '10 min ago', Priority: 'High', Status: 'Unread' },
    { Notification: '28 medicines expire within 90 days', Type: 'Expiration', Date: '1 hr ago', Priority: 'Medium', Status: 'Unread' },
    { Notification: 'Purchase order PO-2025-046 received', Type: 'Purchase', Date: '2 hr ago', Priority: 'Low', Status: 'Read' },
  ] },
  reports: { description: 'Review pharmacy performance and export operational reports.', action: 'Generate Report', columns: ['Report', 'Period', 'Generated By', 'Date', 'Format'], rows: [
    { Report: 'Inventory Summary', Period: 'February 2025', 'Generated By': 'Sofia Admin', Date: 'Feb 24, 2025', Format: 'PDF' },
    { Report: 'Monthly Transactions', Period: 'January 2025', 'Generated By': 'Angela Ramos', Date: 'Feb 01, 2025', Format: 'CSV' },
    { Report: 'Expiration Forecast', Period: 'Q1 2025', 'Generated By': 'Sofia Admin', Date: 'Jan 28, 2025', Format: 'PDF' },
  ] },
  'audit-logs': { description: 'A record of recent changes and actions in the system.', action: 'Export Logs', columns: ['User', 'Action', 'Details', 'Date & Time', 'IP Address'], rows: [
    { User: 'Angela Ramos', Action: 'Stock received', Details: 'Amoxil · +120 units', 'Date & Time': 'Today, 9:42 AM', 'IP Address': '192.168.1.24' },
    { User: 'Sofia Admin', Action: 'Medicine updated', Details: 'Biogesic · Unit price', 'Date & Time': 'Today, 8:56 AM', 'IP Address': '192.168.1.10' },
    { User: 'Roberto Cruz', Action: 'Prescription verified', Details: 'RX-2025-1842 · Maria Santos', 'Date & Time': 'Today, 8:40 AM', 'IP Address': '192.168.1.32' },
  ] },
}

const pageLabels = Object.fromEntries(navigation.flatMap((group) => group.links.map((link) => [link.id, link.label]))) as Record<PageId, string>

const activities = [
  { initials: 'AR', title: 'Angela recorded stock in', detail: 'Amoxil · +120 units', time: '12 min ago', color: 'blue' },
  { initials: 'RC', title: 'Dr. Cruz verified prescription', detail: 'RX-2025-1842 · Maria Santos', time: '28 min ago', color: 'teal' },
  { initials: 'SA', title: 'You updated medicine details', detail: 'Biogesic · Unit price', time: '1 hr ago', color: 'purple' },
  { initials: 'AR', title: 'Angela received purchase order', detail: 'PO-2025-046 · 14 items', time: '2 hr ago', color: 'orange' },
]

function DashboardHome({ onNavigate, onAddMedicine, search }: { onNavigate: (page: PageId) => void; onAddMedicine: () => void; search: string }) {
  const [period, setPeriod] = useState('Last 7 months')
  const visibleActivities = activities.filter((activity) => `${activity.title} ${activity.detail}`.toLowerCase().includes(search.toLowerCase()))
  const stats: { label: string; value: string; detail: string; icon: string; tone: string; page: PageId }[] = [
    { label: 'Total Medicines', value: '0', detail: '0 this month', icon: '◈', tone: 'blue', page: 'medicines' },
    { label: 'Categories', value: '0', detail: '0 main groups', icon: '▦', tone: 'violet', page: 'categories' },
    { label: 'Total Stock', value: '0', detail: '₱0 value', icon: '▤', tone: 'teal', page: 'inventory' },
    { label: 'Low Stock', value: '0', detail: '0 need attention', icon: '⚠', tone: 'amber', page: 'inventory' },
    { label: 'Out of Stock', value: '0', detail: '0 urgent restocks', icon: '⊘', tone: 'red', page: 'inventory' },
    { label: 'Expiring Soon', value: '0', detail: '0 within 90 days', icon: '◷', tone: 'orange', page: 'expiration' },
    { label: 'Total Users', value: '0', detail: '0 staff · 0 patients', icon: '♙', tone: 'indigo', page: 'user-management' },
  ]

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-date">MONDAY, FEBRUARY 24</p><h1>Good morning, Sofia</h1><p className="admin-muted">Here’s what’s happening across your pharmacy today.</p></div>
        <button className="admin-primary" onClick={onAddMedicine}><span>＋</span> Add Medicine</button>
      </div>

      <section className="admin-stat-grid">
        {stats.map((stat) => <button className="admin-stat-card" key={stat.label} onClick={() => onNavigate(stat.page)}><span className={`admin-stat-icon ${stat.tone}`}>{stat.icon}</span><span className="admin-stat-copy"><small>{stat.label}</small><strong>{stat.value}</strong><em>{stat.detail}</em></span><span className="admin-stat-arrow">↗</span></button>)}
      </section>

      <section className="admin-dashboard-grid top-panels">
        <article className="admin-card inventory-chart-card">
          <header className="admin-card-header"><div><h2>Inventory Overview</h2><p>Stock movement over the last 7 months</p></div><select aria-label="Chart period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 7 months</option><option>This year</option></select></header>
          <div className="chart-legend"><span><i className="legend-in" />Stock In</span><span><i className="legend-out" />Stock Out</span></div>
          <div className="inventory-chart">
            <div className="chart-y-labels"><span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span></div>
            <svg viewBox="0 0 620 180" preserveAspectRatio="none" role="img" aria-label={`${period} stock movement chart`}>
              {[10, 50, 90, 130, 170].map((y) => <line key={y} x1="0" x2="620" y1={y} y2={y} stroke="#edf1f7" />)}
              <path d="M0 170 H620" fill="none" stroke="#3678e8" strokeWidth="3" />
              <path d="M0 170 H620" fill="none" stroke="#15b8a6" strokeWidth="2" />
            </svg>
            <div className="chart-x-labels">{(period === 'This year' ? ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'] : ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']).map((month) => <span key={month}>{month}</span>)}</div>
          </div>
        </article>

        <article className="admin-card expiration-card">
          <header className="admin-card-header"><div><h2>Expiration Overview</h2><p>Medicine status by batch</p></div><button className="admin-text-button" onClick={() => onNavigate('expiration')}>View details</button></header>
          <div className="expiration-content">
            <div className="donut-chart"><div><strong>0</strong><small>Total batches</small></div></div>
            <div className="expiration-legend"><div><span><i className="safe-dot" />Safe</span><strong>0</strong></div><div><span><i className="soon-dot" />Expiring soon</span><strong>0</strong></div><div><span><i className="expired-dot" />Expired</span><strong>0</strong></div></div>
          </div>
          <button className="expiration-alert" onClick={() => onNavigate('expiration')}><span>⚠</span><span><strong>0 medicines expire within 90 days</strong><small>Review and plan stock rotation.</small></span><b>→</b></button>
        </article>
      </section>

      <section className="admin-dashboard-grid bottom-panels">
        <article className="admin-card transactions-card">
          <header className="admin-card-header"><div><h2>Monthly Transactions</h2><p>Inventory movements this month</p></div><button className="admin-text-button" onClick={() => onNavigate('reports')}>View report</button></header>
          <div className="transaction-grid">
            <div><span className="transaction-symbol stock-in">↓</span><small>Stock In</small><strong>0 units</strong></div>
            <div><span className="transaction-symbol stock-out">↑</span><small>Stock Out</small><strong>0 units</strong></div>
            <div><span className="transaction-symbol adjustment">↔</span><small>Adjustments</small><strong>0 units</strong></div>
            <div><span className="transaction-symbol transfer">⇄</span><small>Transfers</small><strong>0 units</strong></div>
          </div>
        </article>
        <article className="admin-card activity-card">
          <header className="admin-card-header"><div><h2>Recent Activities</h2><p>Latest actions from your team</p></div><button className="admin-text-button" onClick={() => onNavigate('audit-logs')}>View all</button></header>
          <div className="activity-list">{visibleActivities.map((activity) => <div className="activity-row" key={activity.title}><span className={`activity-avatar ${activity.color}`}>{activity.initials}</span><div><strong>{activity.title}</strong><small>{activity.detail}</small></div><time>{activity.time}</time></div>)}{visibleActivities.length === 0 && <p className="table-empty">No activities match your search.</p>}</div>
        </article>
      </section>
    </>
  )
}

function MedicineTable({ medicines, query, onQueryChange }: { medicines: Medicine[]; query: string; onQueryChange: (value: string) => void }) {
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const filtered = medicines.filter((medicine) => {
    const matchesQuery = Object.values(medicine).some((value) => value.toLowerCase().includes(query.toLowerCase()))
    const matchesStatus = statusFilter === 'All Status' || medicine.status === statusFilter
    const matchesCategory = categoryFilter === 'All Categories' || medicine.category === categoryFilter
    return matchesQuery && matchesStatus && matchesCategory
  })
  return (
    <article className="admin-card data-table-card">
      <div className="table-toolbar"><label className="admin-table-search"><span>⌕</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search medicines..." /></label><select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All Categories</option>{Array.from(new Set(medicines.map((medicine) => medicine.category))).map((category) => <option key={category}>{category}</option>)}</select><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr>{['Medicine', 'Generic Name', 'Category', 'Stock', 'Unit Price', 'Status', ''].map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{filtered.map((medicine) => <tr key={medicine.code}><td><strong>{medicine.name}</strong><small>{medicine.code}</small></td><td>{medicine.generic}</td><td>{medicine.category}</td><td>{medicine.stock} units</td><td>{medicine.unitPrice}</td><td><span className={`status-pill ${medicine.status.toLowerCase().replaceAll(' ', '-')}`}>{medicine.status}</span></td><td><button className="row-menu" aria-label={`Actions for ${medicine.name}`}>•••</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="table-empty">No medicines match your search.</p>}</div>
      <footer className="table-footer"><span>Showing {filtered.length} of {medicines.length} medicines</span><div><button disabled>Previous</button><button className="page-number">1</button><button>2</button><button>3</button><button>Next</button></div></footer>
    </article>
  )
}

function ModulePage({ page, query, onQueryChange, onAction }: { page: PageId; query: string; onQueryChange: (value: string) => void; onAction: () => void }) {
  const [statusFilter, setStatusFilter] = useState('All Status')
  const data = pageTables[page]
  if (!data) return <SettingsPage />
  const statusOptions = Array.from(new Set(data.rows.map((row) => row.Status || row.Priority).filter((value): value is string => Boolean(value))))
  const filteredRows = data.rows.filter((row) => {
    const matchesQuery = Object.values(row).some((value) => value.toLowerCase().includes(query.toLowerCase()))
    const matchesStatus = statusFilter === 'All Status' || row.Status === statusFilter || row.Priority === statusFilter
    return matchesQuery && matchesStatus
  })
  return (
    <section className="module-page">
      <div className="admin-page-heading"><div><p className="admin-date">PHARMACY MANAGEMENT</p><h1>{pageLabels[page]}</h1><p className="admin-muted">{data.description}</p></div><button className="admin-primary" onClick={onAction}><span>＋</span> {data.action}</button></div>
      <div className="module-summary"><div><small>Total {pageLabels[page]}</small><strong>0</strong><span>Updated just now</span></div><div><small>Needs attention</small><strong className="summary-warning">0</strong><span>Review items below</span></div><div><small>Active this month</small><strong>0%</strong><span className="summary-positive">Compared to last month</span></div></div>
      <article className="admin-card data-table-card module-table">
        <header className="module-table-heading"><div><h2>{page === 'expiration' ? 'Upcoming Expirations' : `All ${pageLabels[page]}`}</h2><p>Review and manage records in your pharmacy.</p></div><button className="admin-outline-button">⇩ Export</button></header>
        <div className="table-toolbar"><label className="admin-table-search"><span>⌕</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={`Search ${pageLabels[page].toLowerCase()}...`} /></label><select aria-label="Filter records" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All Status</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="admin-table-scroll"><table className="admin-table"><thead><tr>{data.columns.map((column) => <th key={column}>{column}</th>)}<th /></tr></thead><tbody>{filteredRows.map((row, index) => <tr key={`${page}-${index}`}>{data.columns.map((column) => <td key={column}>{column === 'Status' || column === 'Priority' ? <span className={`status-pill ${row[column].toLowerCase().replaceAll(' ', '-')}`}>{row[column]}</span> : row[column]}</td>)}<td><button className="row-menu" aria-label="Row actions">•••</button></td></tr>)}</tbody></table>{filteredRows.length === 0 && <p className="table-empty">No records match your search.</p>}</div>
        <footer className="table-footer"><span>Showing {filteredRows.length} records</span><div><button disabled>Previous</button><button className="page-number">1</button><button>Next</button></div></footer>
      </article>
    </section>
  )
}

function SettingsPage() {
  return (
    <section className="module-page">
      <div className="admin-page-heading"><div><p className="admin-date">SYSTEM PREFERENCES</p><h1>Settings</h1><p className="admin-muted">Manage your pharmacy profile and workspace preferences.</p></div></div>
      <div className="settings-grid"><article className="admin-card settings-card"><h2>Pharmacy Profile</h2><p>Basic information about your pharmacy.</p><label>Pharmacy name<input defaultValue="MedTrack Pharmacy" /></label><label>Contact email<input defaultValue="admin@medtrack.ph" /></label><label>Contact number<input defaultValue="+63 2 8123 4567" /></label><button className="admin-primary">Save Changes</button></article><article className="admin-card settings-card"><h2>Notifications</h2><p>Choose which pharmacy alerts you receive.</p>{['Low stock alerts', 'Medicine expiration alerts', 'New prescription requests', 'Purchase order updates'].map((setting, index) => <label className="setting-toggle" key={setting}><span>{setting}<small>Receive updates about {setting.toLowerCase()}.</small></span><input type="checkbox" defaultChecked={index < 3} /></label>)}</article></div>
    </section>
  )
}

function MedicineModal({ onClose, onSave }: { onClose: () => void; onSave: (medicine: Medicine) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSave({
      code: `MED-${Date.now().toString().slice(-4)}`,
      name: String(formData.get('name')),
      generic: String(formData.get('generic')),
      category: String(formData.get('category')),
      stock: String(formData.get('stock')),
      unitPrice: `₱${Number(formData.get('price')).toFixed(2)}`,
      status: Number(formData.get('stock')) > 50 ? 'In Stock' : 'Low Stock',
    })
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="add-medicine-title"><header><div><h2 id="add-medicine-title">Add Medicine</h2><p>Enter the medicine details to add it to your catalog.</p></div><button onClick={onClose} aria-label="Close dialog">×</button></header><form onSubmit={submit}><label>Medicine name<input name="name" required placeholder="e.g. Biogesic 500mg" /></label><label>Generic name<input name="generic" required placeholder="e.g. Paracetamol" /></label><div className="modal-fields"><label>Category<select name="category" defaultValue="Analgesics"><option>Analgesics</option><option>Antibiotics</option><option>Cardiovascular</option><option>Vitamins</option></select></label><label>Stock quantity<input name="stock" type="number" min="0" required placeholder="0" /></label></div><div className="modal-fields"><label>Unit price<input name="price" type="number" min="0" step="0.01" required placeholder="0.00" /></label><label>Expiry date<input name="expiry" type="date" /></label></div><footer><button type="button" className="admin-outline-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary">Save Medicine</button></footer></form></section></div>
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [search, setSearch] = useState('')
  const [medicines, setMedicines] = useState(initialMedicines)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function saveMedicine(medicine: Medicine) {
    setMedicines((current) => [medicine, ...current])
    setIsModalOpen(false)
    setActivePage('medicines')
    setSearch('')
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#/admin"><span className="brand-symbol">✚</span><span><strong>MedTrack</strong><small>PHARMACY ADMIN</small></span></a>
        <nav className="admin-navigation" aria-label="Pharmacy administration">
          {navigation.map((group) => <section key={group.heading}><p>{group.heading}</p>{group.links.map((link) => <button className={activePage === link.id ? 'active' : ''} key={link.id} onClick={() => { setActivePage(link.id); setSearch('') }}><span className="nav-icon">{link.icon}</span><span>{link.label}</span>{link.id === 'notifications' && <i>0</i>}</button>)}</section>)}
        </nav>
        <div className="admin-sidebar-user"><span className="admin-avatar">SA</span><span><strong>Sofia Admin</strong><small>Super Admin</small></span><button aria-label="Sign out" onClick={() => { window.location.hash = '#/login' }}>↪</button></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar"><button className="sidebar-toggle" aria-label="Toggle sidebar">☰</button><label className="global-admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medicines, orders, users..." /><kbd>⌘ K</kbd></label><div className="admin-top-actions"><button className="help-button">? <span>Help</span></button><div className="top-action-wrap"><button className="top-icon-button" aria-label="Notifications" onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }}>♧<i>0</i></button>{notificationsOpen && <div className="top-popover"><strong>Notifications</strong><p>Losartan 50mg is below reorder level.</p><p>28 medicines expire within 90 days.</p><button onClick={() => { setActivePage('notifications'); setNotificationsOpen(false) }}>View all notifications</button></div>}</div><div className="top-action-wrap"><button className="profile-button" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }}><span>SA</span><b>Sofia Admin</b><i>⌄</i></button>{profileOpen && <div className="top-popover profile-popover"><strong>Sofia Admin</strong><p>Super Admin</p><button onClick={() => setActivePage('settings')}>Account settings</button><button onClick={() => { window.location.hash = '#/login' }}>Sign out</button></div>}</div></div></header>

        <div className="admin-content">
          {activePage === 'dashboard'
            ? <DashboardHome onNavigate={setActivePage} onAddMedicine={() => setIsModalOpen(true)} search={search} />
            : activePage === 'medicines'
              ? <section className="module-page"><div className="admin-page-heading"><div><p className="admin-date">PHARMACY MANAGEMENT</p><h1>Medicines</h1><p className="admin-muted">Manage your medicine catalog, pricing, and availability.</p></div><button className="admin-primary" onClick={() => setIsModalOpen(true)}><span>＋</span> Add Medicine</button></div><div className="module-summary"><div><small>Total Medicines</small><strong>0</strong><span>0 this month</span></div><div><small>Low Stock</small><strong className="summary-warning">0</strong><span>Needs attention</span></div><div><small>Out of Stock</small><strong>0</strong><span>Restock urgently</span></div></div><MedicineTable medicines={medicines} query={search} onQueryChange={setSearch} /></section>
              : <ModulePage page={activePage} query={search} onQueryChange={setSearch} onAction={() => activePage === 'categories' ? setActivePage('medicines') : setIsModalOpen(true)} />}
        </div>
      </section>
      {isModalOpen && <MedicineModal onClose={() => setIsModalOpen(false)} onSave={saveMedicine} />}
    </main>
  )
}