import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import BrandLogo from '../../components/BrandLogo'
import GlassActionLink from '../../components/GlassActionLink'

type DashboardTab = 'Dashboard' | 'Inventory' | 'Stock In' | 'Stock Out' | 'Expiry Tracking' | 'Reports'
type ActivityTone = 'green' | 'orange' | 'blue' | 'red'

type Medicine = {
  id: string
  name: string
  category: string
  batch: string
  quantity: number
  reorderLevel: number
  expiryDate: string
}

type ActivityEntry = {
  title: string
  detail: string
  time: string
  tone: ActivityTone
}

const tabItems: { name: DashboardTab; icon: string }[] = [
  { name: 'Dashboard', icon: '▦' },
  { name: 'Inventory', icon: '▤' },
  { name: 'Stock In', icon: '↓' },
  { name: 'Stock Out', icon: '↑' },
  { name: 'Expiry Tracking', icon: '◷' },
  { name: 'Reports', icon: '▧' },
]

function dateAfter(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function todayAsInputDate() {
  return dateAfter(0)
}

function daysUntilExpiry(expiryDate: string) {
  const expiry = new Date(`${expiryDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000)
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const initialInventory: Medicine[] = [
  { id: 'med-1', name: 'Paracetamol 500mg', category: 'Pain relief', batch: 'PR-2048', quantity: 450, reorderLevel: 120, expiryDate: dateAfter(12) },
  { id: 'med-2', name: 'Amoxicillin 500mg', category: 'Antibiotic', batch: 'AM-1831', quantity: 82, reorderLevel: 100, expiryDate: dateAfter(19) },
  { id: 'med-3', name: 'Vitamin C 100mg', category: 'Supplement', batch: 'VC-3021', quantity: 240, reorderLevel: 80, expiryDate: dateAfter(140) },
  { id: 'med-4', name: 'Cetirizine 10mg', category: 'Allergy relief', batch: 'CT-0984', quantity: 0, reorderLevel: 80, expiryDate: dateAfter(24) },
  { id: 'med-5', name: 'Ibuprofen 200mg', category: 'Pain relief', batch: 'IB-1128', quantity: 520, reorderLevel: 120, expiryDate: dateAfter(220) },
  { id: 'med-6', name: 'Omeprazole 20mg', category: 'Digestive health', batch: 'OM-4251', quantity: 65, reorderLevel: 90, expiryDate: dateAfter(35) },
]

const initialActivities: ActivityEntry[] = [
  { title: 'Paracetamol 500mg', detail: 'Stock received · 1,000 pcs', time: '10:42 AM', tone: 'green' },
  { title: 'Amoxicillin 500mg', detail: 'Stock issued · 200 pcs', time: '09:18 AM', tone: 'orange' },
  { title: 'Vitamin C 100mg', detail: 'Stock received · 500 pcs', time: 'Yesterday', tone: 'blue' },
  { title: 'Expired items reported', detail: '12 items · Storage A', time: 'Yesterday', tone: 'red' },
]

const stockLevels = [
  { day: 'Mon', available: 72, low: 18 },
  { day: 'Tue', available: 84, low: 28 },
  { day: 'Wed', available: 65, low: 22 },
  { day: 'Thu', available: 92, low: 31 },
  { day: 'Fri', available: 77, low: 16 },
  { day: 'Sat', available: 58, low: 24 },
  { day: 'Sun', available: 88, low: 19 },
] as const

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
}

const dashboardPanelClass = 'min-w-0 rounded-xl border border-[#e9edf4] bg-white shadow-[0_3px_12px_#24436e08]'
const panelHeadingClass = 'flex items-start justify-between gap-3'
const tableHeaderCellClass = 'whitespace-nowrap bg-[#f9fbfd] px-[15px] py-3 text-left text-[13px] font-semibold text-[#8b98aa]'
const tableCellClass = 'whitespace-nowrap border-t border-[#f0f3f7] px-[15px] py-[14px] text-[13px] text-[#718198]'
const tableCellStrongClass = 'text-[14px] font-semibold text-[#354c67]'
const dashboardButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#73a8d7] bg-gradient-to-r from-[#67a5d9] to-[#4a8cc9] px-[14px] text-[14px] font-semibold text-white shadow-[0_6px_14px_#3a7db820] transition-[filter,transform] hover:-translate-y-px hover:saturate-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4389d5] motion-reduce:transition-none'
const dashboardFieldClass = 'grid gap-[7px] text-[14px] font-semibold text-[#546a83]'
const dashboardInputClass = 'min-h-[42px] w-full rounded-[9px] border border-[#e3eaf2] bg-white px-[11px] text-[14px] font-normal text-[#344b66] outline-none placeholder:text-[#a4afbd] focus:border-[#91bbdf] focus:shadow-[0_0_0_3px_#8db9df21]'
const statusClasses = {
  healthy: 'bg-[#e9f8f2] text-[#188a68]',
  low: 'bg-[#fff5e3] text-[#b87519]',
  out: 'bg-[#fff0ef] text-[#c65e5c]',
  expired: 'bg-[#fff0ef] text-[#c65e5c]',
}

function AnimatedValue({ value }: { value: number }) {
  const valueRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const element = valueRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const counter = { value: 0 }
    gsap.to(counter, {
      value,
      duration: 1.1,
      delay: 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(counter.value).toLocaleString()
      },
    })
  }, { dependencies: [value], revertOnUpdate: true })

  return <span ref={valueRef}>{value.toLocaleString()}</span>
}

function MedicineStatus({ medicine }: { medicine: Medicine }) {
  const status = medicine.quantity === 0 ? 'out' : medicine.quantity <= medicine.reorderLevel ? 'low' : 'healthy'
  const label = status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock'
  return <span className={`inline-flex min-h-[23px] items-center rounded-full px-2 text-[14px] font-semibold ${statusClasses[status]}`}>{label}</span>
}

function InventoryTable({ inventory, onStockIn }: { inventory: Medicine[]; onStockIn: (medicineId: string) => void }) {
  if (inventory.length === 0) {
    return <div className="grid min-h-[230px] place-content-center justify-items-center p-6 text-center"><span className="mb-3 grid size-[42px] place-items-center rounded-[14px] bg-[#edf6ff] text-xl text-[#5593ca]">⌕</span><b className="text-xs text-[#435b77]">No medicines found</b><p className="mt-[7px] max-w-[320px] text-[14px] leading-relaxed text-[#91a0b2]">Try a different search or add a new medicine to your inventory.</p></div>
  }

  return (
    <div className="w-full overflow-x-auto border-t border-[#edf1f6]">
      <table className="w-full min-w-[810px] border-collapse text-left">
        <thead><tr>{['Medicine', 'Category', 'Batch', 'On hand', 'Expiry date', 'Status', ''].map((heading) => <th className={tableHeaderCellClass} key={heading || 'action'}>{heading}</th>)}</tr></thead>
        <tbody>
          {inventory.map((medicine) => (
            <tr key={medicine.id}>
              <td className={tableCellClass}><b className={tableCellStrongClass}>{medicine.name}</b></td>
              <td className={tableCellClass}>{medicine.category}</td>
              <td className={tableCellClass}>{medicine.batch}</td>
              <td className={tableCellClass}>{medicine.quantity.toLocaleString()} <small className="text-[14px] text-[#9aa6b8]">units</small></td>
              <td className={tableCellClass}>{formatDate(medicine.expiryDate)}</td>
              <td className={tableCellClass}><MedicineStatus medicine={medicine} /></td>
              <td className={tableCellClass}><button className="whitespace-nowrap rounded-[7px] bg-[#f0f7fe] px-2 py-1.5 text-[14px] font-semibold text-[#4384c1] transition-colors hover:bg-[#e3f1ff] hover:text-[#286ba9]" type="button" onClick={() => onStockIn(medicine.id)}>Receive stock</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DashboardOverview({
  inventory,
  activities,
  onNavigate,
}: {
  inventory: Medicine[]
  activities: ActivityEntry[]
  onNavigate: (tab: DashboardTab) => void
}) {
  const totalUnits = inventory.reduce((total, medicine) => total + medicine.quantity, 0)
  const lowStockCount = inventory.filter((medicine) => medicine.quantity > 0 && medicine.quantity <= medicine.reorderLevel).length
  const outOfStockCount = inventory.filter((medicine) => medicine.quantity === 0).length
  const stats = [
    { label: 'Medicine types', value: inventory.length, change: 'Active products', icon: '◈', tone: 'blue' },
    { label: 'Available units', value: totalUnits, change: 'Across all batches', icon: '✓', tone: 'green' },
    { label: 'Low stock items', value: lowStockCount, change: 'Needs attention', icon: '⚠', tone: 'amber' },
    { label: 'Out of stock', value: outOfStockCount, change: 'View inventory', icon: '+', tone: 'red' },
  ] as const
  const expiringSoon = inventory
    .filter((medicine) => daysUntilExpiry(medicine.expiryDate) <= 30)
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
    .slice(0, 3)

  return (
    <>
      <motion.section className="mb-[18px] grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1" aria-label="Inventory statistics" variants={staggerVariants} initial="hidden" animate="visible">
        {stats.map((card) => (
          <motion.article className={`${dashboardPanelClass} min-h-[140px] p-[15px]`} key={card.label} variants={cardVariants} whileHover={{ y: -3, transition: { duration: 0.18 } }}>
            <div className="mb-[14px] flex items-center justify-between"><span className={`grid size-[30px] place-items-center rounded-[10px] text-[13px] font-semibold ${card.tone === 'blue' ? 'bg-[#edf5ff] text-[#3d84d1]' : card.tone === 'green' ? 'bg-[#eaf8f1] text-[#2da47b]' : card.tone === 'amber' ? 'bg-[#fff5e3] text-[#c3882c]' : 'bg-[#fff0ef] text-[#c86663]'}`}>{card.icon}</span><span className="text-sm leading-none tracking-[2px] text-[#aab5c2]" aria-hidden="true">···</span></div>
            <p className="mb-1 text-[13px] font-medium text-[#8998aa]">{card.label}</p>
            <strong className="block text-[22px] font-bold leading-tight tracking-[-0.8px] text-[#273e59]"><AnimatedValue value={card.value} /></strong>
            <small className={`mt-[7px] block text-[14px] ${card.tone === 'green' ? 'font-medium text-[#218f6e]' : card.tone === 'amber' || card.tone === 'red' ? 'font-medium text-[#b77d2d]' : 'text-[#9aa7b7]'}`}>{card.change}</small>
          </motion.article>
        ))}
      </motion.section>

      <div className="mb-[18px] grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-4 max-[1100px]:grid-cols-1">
        <motion.section className={`${dashboardPanelClass} min-h-[270px] p-5`} aria-labelledby="stock-heading" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <div className={panelHeadingClass}><div><h2 id="stock-heading" className="text-[14px] font-semibold text-[#354b66]">Stock overview</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Inventory movement throughout the week</p></div><span className="rounded-full bg-[#f3f7fb] px-[9px] py-[6px] text-[14px] font-medium text-[#7d8da2]">This week</span></div>
          <div className="mb-[9px] mt-[17px] flex gap-4 text-[14px] text-[#8190a3]"><span className="inline-flex items-center gap-[5px]"><i className="size-[7px] rounded-full bg-[#76addd]" />Available stock</span><span className="inline-flex items-center gap-[5px]"><i className="size-[7px] rounded-full bg-[#e6b45e]" />Low stock</span></div>
          <div className="relative mt-2 h-[165px] pl-10" role="img" aria-label="Bar chart showing available and low stock levels from Monday to Sunday">
            <div className="absolute inset-0 flex flex-col justify-between pb-[18px] text-[14px] text-[#a0adbc]">{['5,000', '3,750', '2,500', '1,250'].map((value) => <span className="relative leading-none after:absolute after:left-10 after:top-1/2 after:h-px after:w-[min(620px,calc(100vw-590px))] after:bg-[#edf1f6] after:content-[''] max-[1100px]:after:w-[calc(100vw-130px)] max-[560px]:after:w-[calc(100vw-100px)]" key={value}>{value}</span>)}</div>
            <div className="absolute inset-y-0 left-10 right-0 flex items-end justify-around pb-[18px]">{stockLevels.map((item) => <div className="z-[1] flex h-full w-[8%] flex-col items-center justify-end gap-[7px]" key={item.day}><div className="flex h-[calc(100%-16px)] w-full items-end justify-center gap-[2px]"><i className="w-[min(12px,45%)] rounded-t-[3px] bg-[#79b5e5]" style={{ height: `${item.available}%` }} /><i className="w-[min(12px,45%)] rounded-t-[3px] bg-[#e9ba68]" style={{ height: `${item.low}%` }} /></div><small className="text-[14px] text-[#9ba8b7]">{item.day}</small></div>)}</div>
          </div>
        </motion.section>

        <motion.section className={`${dashboardPanelClass} min-h-[270px] p-5`} aria-labelledby="activity-heading" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <div className={panelHeadingClass}><div><h2 id="activity-heading" className="text-[14px] font-semibold text-[#354b66]">Recent activity</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Latest inventory updates</p></div><button className="whitespace-nowrap text-[14px] font-semibold text-[#4c87be] hover:text-[#286ba9]" type="button" onClick={() => onNavigate('Inventory')}>View inventory <span>→</span></button></div>
          <div className="mt-[14px]">
            {activities.slice(0, 4).map((activity, index) => (
              <motion.article className="flex items-start gap-[10px] border-b border-[#f1f3f6] py-[11px] last:border-0" key={`${activity.title}-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <span className={`mt-[2px] grid size-[23px] shrink-0 place-items-center rounded-full text-[14px] ${activity.tone === 'green' ? 'bg-[#e9f8f2] text-[#218e6e]' : activity.tone === 'orange' ? 'bg-[#fff5e3] text-[#b87a22]' : activity.tone === 'blue' ? 'bg-[#edf5ff] text-[#3d84d1]' : 'bg-[#fff0ef] text-[#c86663]'}`}>•</span>
                <div className="min-w-0 flex-1"><b className="block truncate text-[13px] font-semibold text-[#455b75]">{activity.title}</b><small className="mt-1 block text-[14px] text-[#97a3b2]">{activity.detail}</small></div>
                <time className="shrink-0 pt-0.5 text-[13px] text-[#a0adbc]">{activity.time}</time>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section className={`${dashboardPanelClass} p-5`} aria-labelledby="expiry-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.15 }}>
        <div className={panelHeadingClass}><div><h2 id="expiry-heading" className="text-[14px] font-semibold text-[#354b66]">Expiring soon</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Medicines that need your attention</p></div><button className="whitespace-nowrap text-[14px] font-semibold text-[#4c87be] hover:text-[#286ba9]" type="button" onClick={() => onNavigate('Expiry Tracking')}>View expiry list <span>→</span></button></div>
        <div className="mt-[14px]">
          {expiringSoon.length === 0 && <p className="py-4 text-[13px] text-[#9aa7b7]">No medicines are due to expire in the next 30 days.</p>}
          {expiringSoon.map((medicine) => {
            const days = daysUntilExpiry(medicine.expiryDate)
            return <div className="grid grid-cols-[30px_minmax(100px,1fr)_minmax(75px,0.8fr)_auto] items-center gap-[10px] border-t border-[#f1f3f6] py-[11px] max-[560px]:grid-cols-[30px_1fr_auto]" key={medicine.id}><span className="grid size-[29px] place-items-center rounded-[9px] bg-[#edf6ff] text-[14px] font-semibold text-[#4b8ac4]">{medicine.name[0]}</span><b className="truncate text-[13px] font-semibold text-[#455b75]">{medicine.name}</b><small className="text-[14px] text-[#99a5b4] max-[560px]:hidden">Batch #{medicine.batch}</small><span className={`whitespace-nowrap text-[14px] font-medium ${days < 0 ? 'text-[#c65e5c]' : 'text-[#bc8533]'}`}>{days < 0 ? 'Expired' : `Expires in ${days} days`}</span></div>
          })}
        </div>
      </motion.section>
    </>
  )
}

function StockMovementForm({
  direction,
  inventory,
  selectedMedicineId,
  onMedicineChange,
  error,
  onSubmit,
}: {
  direction: 'in' | 'out'
  inventory: Medicine[]
  selectedMedicineId: string
  onMedicineChange: (id: string) => void
  error: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const selectedMedicine = inventory.find((medicine) => medicine.id === selectedMedicineId)
  const eligibleMedicines = direction === 'out' ? inventory.filter((medicine) => medicine.quantity > 0) : inventory

  return (
    <section className={`${dashboardPanelClass} max-w-[650px] p-5`}>
      <div className={`${panelHeadingClass} mb-5`}><div><h2 className="text-[14px] font-semibold text-[#354b66]">{direction === 'in' ? 'Receive stock' : 'Issue stock'}</h2><p className="mt-1 text-[13px] text-[#95a2b3]">{direction === 'in' ? 'Record a delivery into your inventory.' : 'Record stock issued from your inventory.'}</p></div><span className={`grid size-[34px] place-items-center rounded-[10px] text-base font-semibold ${direction === 'in' ? 'bg-[#eaf8f1] text-[#2c9c75]' : 'bg-[#fff4e5] text-[#bd842d]'}`}>{direction === 'in' ? '↓' : '↑'}</span></div>
      <form className="grid gap-[15px]" onSubmit={onSubmit}>
        <label className={dashboardFieldClass}>
          <span>Medicine</span>
          <select className={dashboardInputClass} name="medicineId" value={selectedMedicineId} onChange={(event) => onMedicineChange(event.target.value)} required>
            <option value="">Select a medicine</option>
            {eligibleMedicines.map((medicine) => <option value={medicine.id} key={medicine.id}>{medicine.name} · {medicine.quantity} on hand</option>)}
          </select>
        </label>
        <label className={dashboardFieldClass}>
          <span>Quantity</span>
          <input className={dashboardInputClass} name="quantity" type="number" min="1" max={direction === 'out' ? selectedMedicine?.quantity : 100000} step="1" required placeholder="Enter whole units" />
          <small className="text-[14px] font-normal text-[#98a5b5]">{direction === 'out' ? `Available: ${selectedMedicine?.quantity ?? 0} units` : 'Enter a positive whole number of units.'}</small>
        </label>
        {error && <p className="rounded-lg border border-[#f2d5d4] bg-[#fff4f3] px-3 py-2 text-[13px] text-[#bd5956]" role="alert">{error}</p>}
        <button className={`${dashboardButtonClass} justify-self-start`} type="submit">{direction === 'in' ? 'Confirm stock received' : 'Confirm stock issued'} <span>→</span></button>
      </form>
    </section>
  )
}

function AddMedicineModal({
  error,
  onClose,
  onSubmit,
}: {
  error: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#172b43]/40 p-4 backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <motion.section className="max-h-[min(760px,calc(100vh-32px))] w-full max-w-[530px] overflow-y-auto rounded-[18px] border border-white/70 bg-white p-5 shadow-[0_24px_70px_#1c35542e] max-[560px]:p-4" role="dialog" aria-modal="true" aria-labelledby="add-medicine-heading" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}>
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="mb-[7px] text-[14px] font-bold tracking-[1.4px] text-[#7c95b1]">INVENTORY</p><h2 id="add-medicine-heading" className="text-[14px] font-bold text-[#354b66]">Add a medicine</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Enter the item details to add it to your inventory.</p></div><button className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f3f6fa] text-lg leading-none text-[#718198] transition-colors hover:bg-[#e9eff6]" type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
        <form className="grid gap-[13px]" onSubmit={onSubmit}>
          <label className={dashboardFieldClass}><span>Medicine name</span><input className={dashboardInputClass} autoFocus name="name" required minLength={2} maxLength={80} placeholder="e.g. Paracetamol 500mg" /></label>
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            <label className={dashboardFieldClass}><span>Category</span><select className={dashboardInputClass} name="category" required defaultValue=""><option value="" disabled>Select category</option><option>Pain relief</option><option>Antibiotic</option><option>Supplement</option><option>Allergy relief</option><option>Digestive health</option><option>Other</option></select></label>
            <label className={dashboardFieldClass}><span>Batch number</span><input className={dashboardInputClass} name="batch" required minLength={2} maxLength={32} pattern="[A-Za-z0-9-]+" title="Use letters, numbers, and hyphens only." placeholder="e.g. PR-2048" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            <label className={dashboardFieldClass}><span>Quantity</span><input className={dashboardInputClass} name="quantity" type="number" min="0" max="100000" step="1" required placeholder="0" /></label>
            <label className={dashboardFieldClass}><span>Reorder level</span><input className={dashboardInputClass} name="reorderLevel" type="number" min="0" max="100000" step="1" required placeholder="10" /></label>
          </div>
          <label className={dashboardFieldClass}><span>Expiry date</span><input className={dashboardInputClass} name="expiryDate" type="date" min={todayAsInputDate()} required /></label>
          {error && <p className="rounded-lg border border-[#f2d5d4] bg-[#fff4f3] px-3 py-2 text-[13px] text-[#bd5956]" role="alert">{error}</p>}
          <div className="mt-1 flex justify-end gap-2"><button className="min-h-10 rounded-lg border border-[#e3eaf2] bg-white px-4 text-[14px] font-semibold text-[#6d7f94] transition-colors hover:bg-[#f8fafc]" type="button" onClick={onClose}>Cancel</button><button className={dashboardButtonClass} type="submit">Add to inventory <span>→</span></button></div>
        </form>
      </motion.section>
    </motion.div>
  )
}

function DashboardPage() {
  const reduceMotion = useReducedMotion()
  const [inventory, setInventory] = useState(initialInventory)
  const [activities, setActivities] = useState(initialActivities)
  const [activeTab, setActiveTab] = useState<DashboardTab>('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const userName = sessionStorage.getItem('medtrack-user-name')?.trim() || 'Jane Doe'
  const firstName = userName.split(/\s+/)[0]
  const pageDescriptions: Record<DashboardTab, string> = {
    Dashboard: `Here's what's happening with your pharmacy today.`,
    Inventory: 'Find, review, and update the medicines you keep in stock.',
    'Stock In': 'Record deliveries and increase available quantities.',
    'Stock Out': 'Record issued medicines and keep counts accurate.',
    'Expiry Tracking': 'Review medicines approaching their expiry date.',
    Reports: 'Review inventory health and export a stock report.',
  }
  const filteredInventory = inventory.filter((medicine) => {
    const query = searchTerm.trim().toLowerCase()
    return !query || [medicine.name, medicine.category, medicine.batch].some((value) => value.toLowerCase().includes(query))
  })
  const expiringInventory = filteredInventory
    .filter((medicine) => daysUntilExpiry(medicine.expiryDate) <= 90)
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))

  function navigateTo(tab: DashboardTab) {
    setActiveTab(tab)
    setFormError('')
    setSearchTerm('')
  }

  function handleMovementSubmit(direction: 'in' | 'out', event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const medicineId = String(data.get('medicineId') ?? '')
    const quantity = Number(data.get('quantity'))
    const medicine = inventory.find((item) => item.id === medicineId)

    if (!medicine) {
      setFormError('Choose a medicine before submitting.')
      return
    }
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      setFormError('Quantity must be a positive whole number.')
      return
    }
    if (direction === 'out' && quantity > medicine.quantity) {
      setFormError(`Only ${medicine.quantity} units are available for ${medicine.name}.`)
      return
    }

    setInventory((current) => current.map((item) => item.id === medicineId
      ? { ...item, quantity: direction === 'in' ? item.quantity + quantity : item.quantity - quantity }
      : item))
    const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date())
    setActivities((current) => [{
      title: medicine.name,
      detail: `Stock ${direction === 'in' ? 'received' : 'issued'} · ${quantity.toLocaleString()} pcs`,
      time: `Just now · ${time}`,
      tone: direction === 'in' ? 'green' : 'orange',
    }, ...current])
    setFormError('')
    setToast(`${quantity.toLocaleString()} units ${direction === 'in' ? 'received into' : 'issued from'} ${medicine.name}.`)
    event.currentTarget.reset()
    setSelectedMedicineId('')
  }

  function handleAddMedicine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const category = String(data.get('category') ?? '')
    const batch = String(data.get('batch') ?? '').trim()
    const quantity = Number(data.get('quantity'))
    const reorderLevel = Number(data.get('reorderLevel'))
    const expiryDate = String(data.get('expiryDate') ?? '')

    if (name.length < 2) {
      setFormError('Medicine name must contain at least two characters.')
      return
    }
    if (inventory.some((medicine) => medicine.name.toLowerCase() === name.toLowerCase() && medicine.batch.toLowerCase() === batch.toLowerCase())) {
      setFormError('This medicine and batch are already in your inventory.')
      return
    }
    if (!Number.isSafeInteger(quantity) || quantity < 0 || !Number.isSafeInteger(reorderLevel) || reorderLevel < 0) {
      setFormError('Quantity and reorder level must be whole numbers, zero or greater.')
      return
    }
    if (!expiryDate || daysUntilExpiry(expiryDate) < 0) {
      setFormError('Choose a valid expiry date that is today or later.')
      return
    }

    const medicine: Medicine = {
      id: `med-${Date.now()}`,
      name,
      category,
      batch,
      quantity,
      reorderLevel,
      expiryDate,
    }
    setInventory((current) => [medicine, ...current])
    setActivities((current) => [{ title: name, detail: `Added to inventory · Batch ${batch}`, time: 'Just now', tone: 'blue' }, ...current])
    setIsAddModalOpen(false)
    setFormError('')
    setToast(`${name} was added to inventory.`)
    setActiveTab('Inventory')
  }

  function exportReport() {
    const header = ['Medicine', 'Category', 'Batch', 'Quantity', 'Reorder level', 'Expiry date', 'Status']
    const rows = inventory.map((medicine) => [
      medicine.name,
      medicine.category,
      medicine.batch,
      String(medicine.quantity),
      String(medicine.reorderLevel),
      medicine.expiryDate,
      medicine.quantity === 0 ? 'Out of stock' : medicine.quantity <= medicine.reorderLevel ? 'Low stock' : 'In stock',
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'medtrack-inventory-report.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function handleStockIn(medicineId: string) {
    setSelectedMedicineId(medicineId)
    navigateTo('Stock In')
  }

  const pageTitle = activeTab === 'Dashboard' ? `Good morning, ${firstName}` : activeTab

  return (
    <main className="grid min-h-screen grid-cols-[238px_minmax(0,1fr)] bg-[#f7f9fc] font-sans text-[#354b66] max-[1000px]:grid-cols-[205px_minmax(0,1fr)] max-[760px]:block">
      <motion.aside className="sticky top-0 flex h-screen flex-col border-r border-[#e9edf4] bg-white px-[17px] py-5 max-[760px]:static max-[760px]:h-auto max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:border-[#e9edf4] max-[760px]:px-4 max-[760px]:py-3" initial={reduceMotion ? false : { opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <a className="mb-8 inline-flex items-center gap-[9px] px-2 no-underline max-[760px]:mb-3" href="#home" aria-label="MedTrack home"><BrandLogo /></a>
        <p className="mb-[9px] px-[10px] text-[14px] font-bold tracking-[1.4px] text-[#a3afbe] max-[760px]:hidden">WORKSPACE</p>
        <nav className="grid gap-1 max-[760px]:grid-cols-3 max-[760px]:gap-1.5" aria-label="Dashboard navigation">
          {tabItems.map((item) => (
            <button className={`flex min-h-[41px] items-center gap-[10px] rounded-[9px] px-[11px] text-left text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4389d5] max-[760px]:min-h-[36px] max-[760px]:justify-center max-[760px]:px-2 max-[760px]:text-[13px] ${activeTab === item.name ? 'bg-[#edf5ff] text-[#347fc2]' : 'text-[#7f8ea1] hover:bg-[#f5f8fb] hover:text-[#48627e]'}`} type="button" key={item.name} aria-current={activeTab === item.name ? 'page' : undefined} onClick={() => navigateTo(item.name)}>
              <span className="grid size-[19px] shrink-0 place-items-center text-[14px] max-[760px]:hidden">{item.icon}</span>{item.name}
            </button>
          ))}
        </nav>
      </motion.aside>

      <div className="min-w-0">
        <header className="flex min-h-[62px] items-center justify-between gap-4 border-b border-[#e9edf4] bg-white/80 px-7 backdrop-blur-md max-[760px]:min-h-[55px] max-[760px]:px-4">
          <div className="flex items-center gap-2 text-[13px] text-[#9aa7b7]"><span className="max-[560px]:hidden">Workspace</span><b className="font-normal text-[#c2cbd5] max-[560px]:hidden">/</b><strong className="font-semibold text-[#4c627c]">{activeTab}</strong></div>
          <div className="flex min-w-0 items-center gap-3 max-[560px]:gap-2">
            <label className="flex h-[34px] w-[220px] items-center gap-2 rounded-lg border border-[#edf1f6] bg-[#fbfcfd] px-[10px] text-[13px] text-[#9aa8b8] focus-within:border-[#a6c7e4] max-[760px]:w-[180px] max-[560px]:w-[140px] max-[360px]:w-[70px]"><span>⌕</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#445b75] outline-none placeholder:text-[#a7b2c0]" aria-label="Search medicines" placeholder="Search medicines..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label>
            <GlassActionLink href="#/logout">Sign out</GlassActionLink>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1440px] px-7 py-7 max-[760px]:px-4 max-[560px]:py-5">
          <section className="mb-6 flex items-end justify-between gap-4 max-[560px]:items-start max-[560px]:flex-col">
            <div><p className="mb-[7px] text-[14px] font-bold tracking-[1.4px] text-[#8399b1]">{activeTab === 'Dashboard' ? 'OVERVIEW' : 'WORKSPACE'}</p><h1 className="m-0 text-[23px] font-bold leading-tight tracking-[-0.8px] text-[#2c435f] max-[560px]:text-[14px]">{pageTitle}</h1><p className="mt-[7px] text-[14px] text-[#95a2b3]">{pageDescriptions[activeTab]}</p></div>
            <motion.button className={`${dashboardButtonClass} shrink-0`} type="button" onClick={() => { setFormError(''); setIsAddModalOpen(true) }} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}><span>＋</span> Add medicine</motion.button>
          </section>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="min-w-0"
              key={activeTab}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'Dashboard' && <DashboardOverview inventory={inventory} activities={activities} onNavigate={navigateTo} />}

              {activeTab === 'Inventory' && (
                <section className={`${dashboardPanelClass} overflow-hidden`}>
                  <div className={`${panelHeadingClass} p-5 max-[560px]:p-4`}><div><h2 className="text-[14px] font-semibold text-[#354b66]">Medicine inventory</h2><p className="mt-1 text-[13px] text-[#95a2b3]">{filteredInventory.length} of {inventory.length} medicines</p></div><span className="whitespace-nowrap rounded-full bg-[#f3f7fb] px-[9px] py-[6px] text-[14px] font-medium text-[#7d8da2]">{inventory.reduce((total, item) => total + item.quantity, 0).toLocaleString()} units total</span></div>
                  <InventoryTable inventory={filteredInventory} onStockIn={handleStockIn} />
                </section>
              )}

              {(activeTab === 'Stock In' || activeTab === 'Stock Out') && (
                <StockMovementForm
                  direction={activeTab === 'Stock In' ? 'in' : 'out'}
                  inventory={inventory}
                  selectedMedicineId={selectedMedicineId}
                  onMedicineChange={setSelectedMedicineId}
                  error={formError}
                  onSubmit={(event) => handleMovementSubmit(activeTab === 'Stock In' ? 'in' : 'out', event)}
                />
              )}

              {activeTab === 'Expiry Tracking' && (
                <section className={`${dashboardPanelClass} overflow-hidden`}>
                  <div className={`${panelHeadingClass} p-5 max-[560px]:p-4`}><div><h2 className="text-[14px] font-semibold text-[#354b66]">Expiry schedule</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Medicines expiring within the next 90 days</p></div><span className="whitespace-nowrap rounded-full bg-[#f3f7fb] px-[9px] py-[6px] text-[14px] font-medium text-[#7d8da2]">{expiringInventory.length} items</span></div>
                  {expiringInventory.length === 0
                    ? <div className="grid min-h-[230px] place-content-center justify-items-center p-6 text-center"><span className="mb-3 grid size-[42px] place-items-center rounded-[14px] bg-[#edf6ff] text-xl text-[#5593ca]">◷</span><b className="text-xs text-[#435b77]">No upcoming expiries</b><p className="mt-[7px] max-w-[320px] text-[14px] leading-relaxed text-[#91a0b2]">There are no matching medicines in the next 90 days.</p></div>
                    : <div className="w-full overflow-x-auto border-t border-[#edf1f6]"><table className="w-full min-w-[690px] border-collapse text-left"><thead><tr>{['Medicine', 'Batch', 'Quantity', 'Expiry date', 'Time remaining', ''].map((heading) => <th className={tableHeaderCellClass} key={heading || 'action'}>{heading}</th>)}</tr></thead><tbody>
                      {expiringInventory.map((medicine) => {
                        const days = daysUntilExpiry(medicine.expiryDate)
                        return <tr key={medicine.id}><td className={tableCellClass}><b className={tableCellStrongClass}>{medicine.name}</b></td><td className={tableCellClass}>{medicine.batch}</td><td className={tableCellClass}>{medicine.quantity.toLocaleString()} units</td><td className={tableCellClass}>{formatDate(medicine.expiryDate)}</td><td className={tableCellClass}><span className={`inline-flex min-h-[23px] items-center rounded-full px-2 text-[14px] font-semibold ${days < 0 ? statusClasses.expired : days <= 30 ? statusClasses.low : statusClasses.healthy}`}>{days < 0 ? 'Expired' : `${days} days`}</span></td><td className={tableCellClass}><button className="whitespace-nowrap rounded-[7px] bg-[#f0f7fe] px-2 py-1.5 text-[14px] font-semibold text-[#4384c1] transition-colors hover:bg-[#e3f1ff] hover:text-[#286ba9]" type="button" onClick={() => navigateTo('Inventory')}>View item</button></td></tr>
                      })}
                    </tbody></table></div>}
                </section>
              )}

              {activeTab === 'Reports' && (
                <section className={`${dashboardPanelClass} p-5 max-[560px]:p-4`}>
                  <div className={`${panelHeadingClass} mb-5`}><div><h2 className="text-[14px] font-semibold text-[#354b66]">Inventory report</h2><p className="mt-1 text-[13px] text-[#95a2b3]">Current stock status across {inventory.length} medicine types</p></div><button className={dashboardButtonClass} type="button" onClick={exportReport}>Export CSV <span>↓</span></button></div>
                  <div className="mb-6 grid grid-cols-3 gap-3 max-[560px]:grid-cols-1">
                    <article className="rounded-[10px] border border-[#eef1f5] bg-[#fbfcfd] p-3"><span className="mb-2 inline-block size-[7px] rounded-full bg-[#49b28d]" /><small className="block text-[14px] text-[#8796a8]">In stock</small><b className="my-1 block text-xl text-[#344b66]">{inventory.filter((medicine) => medicine.quantity > medicine.reorderLevel).length}</b><span className="text-[14px] text-[#a0adbc]">medicine types</span></article>
                    <article className="rounded-[10px] border border-[#eef1f5] bg-[#fbfcfd] p-3"><span className="mb-2 inline-block size-[7px] rounded-full bg-[#e6b45e]" /><small className="block text-[14px] text-[#8796a8]">Low stock</small><b className="my-1 block text-xl text-[#344b66]">{inventory.filter((medicine) => medicine.quantity > 0 && medicine.quantity <= medicine.reorderLevel).length}</b><span className="text-[14px] text-[#a0adbc]">medicine types</span></article>
                    <article className="rounded-[10px] border border-[#eef1f5] bg-[#fbfcfd] p-3"><span className="mb-2 inline-block size-[7px] rounded-full bg-[#d67873]" /><small className="block text-[14px] text-[#8796a8]">Out of stock</small><b className="my-1 block text-xl text-[#344b66]">{inventory.filter((medicine) => medicine.quantity === 0).length}</b><span className="text-[14px] text-[#a0adbc]">medicine types</span></article>
                  </div>
                  <div><h3 className="mb-3 text-[14px] font-semibold text-[#526983]">Units by medicine</h3>{inventory.map((medicine) => {
                    const maxQuantity = Math.max(1, ...inventory.map((item) => item.quantity))
                    return <div className="grid grid-cols-[minmax(90px,0.7fr)_minmax(80px,2fr)_45px] items-center gap-3 border-t border-[#f1f3f6] py-[10px] max-[560px]:grid-cols-[minmax(80px,1fr)_minmax(55px,1.3fr)_38px]" key={medicine.id}><span className="truncate text-[14px] text-[#718198]">{medicine.name}</span><div className="h-[7px] overflow-hidden rounded-full bg-[#f0f3f7]"><i className="block h-full rounded-full bg-[#78b0df]" style={{ width: `${medicine.quantity / maxQuantity * 100}%` }} /></div><b className="text-right text-[14px] font-semibold text-[#60758d]">{medicine.quantity.toLocaleString()}</b></div>
                  })}</div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && <AddMedicineModal error={formError} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddMedicine} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <motion.div className="fixed bottom-5 right-5 z-40 max-w-[calc(100vw-40px)] rounded-[10px] border border-[#d6eadf] bg-white px-4 py-[11px] text-[14px] font-medium text-[#34785f] shadow-[0_8px_28px_#1c35541a] max-[560px]:bottom-3 max-[560px]:right-3" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>✓ {toast}</motion.div>}
      </AnimatePresence>
    </main>
  )
}

export default DashboardPage
