import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import BrandLogo from '../../components/BrandLogo'
import GlassActionLink from '../../components/GlassActionLink'
import Reveal from '../../components/Reveal'

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const features = [
  ['▥', 'Real-Time', 'Inventory Tracking'],
  ['⚠', 'Low Stock &', 'Expiry Alerts'],
  ['▤', 'Comprehensive', 'Reports'],
  ['♟', 'Multi-User', 'Access'],
  ['▣', 'Supplier', 'Management'],
]

gsap.registerPlugin(ScrollTrigger, useGSAP)

const containerClass = 'mx-auto w-[min(1200px,calc(100%-64px))] max-[650px]:w-[calc(100%-36px)]'

const activities = [
  ['Paracetamol 500mg', 'Stock In · 1,000 pcs', '2h ago', 'teal'],
  ['Amoxicillin 500mg', 'Stock Out · 200 pcs', '3h ago', 'orange'],
  ['Vitamin C 100mg', 'Stock In · 500 pcs', '5h ago', 'blue'],
]

function DashboardPreview() {
  return (
    <div className="flex overflow-hidden rounded-[15px] border border-[#e6edf4] bg-white shadow-[0_20px_55px_#2f587514]">
      <aside className="hidden w-[108px] shrink-0 border-r border-[#edf1f6] bg-[#fbfcfd] p-[10px] sm:block">
        <div className="mb-[11px] px-1 text-[9px] font-bold text-[#3d6c9e]">MedTrack</div>
        {['⌂ Dashboard', '▤ Inventory', '↓ Stock In', '↑ Stock Out', '▧ Reports', '♟ Users', '▣ Suppliers', '⚙ Settings'].map((item, index) => (
          <div className={`mb-1 rounded-[5px] px-[6px] py-[5px] text-[6px] ${index === 0 ? 'bg-[#eaf4fe] font-semibold text-[#4783bd]' : 'text-[#8b9aae]'}`} key={item}>{item}</div>
        ))}
      </aside>
      <section className="min-w-0 flex-1 p-3">
        <div className="mb-[10px] flex h-[23px] items-center rounded-[5px] border border-[#edf1f6] px-2 text-[6px] text-[#9aa8b8]">⌕ &nbsp; Search medicines...</div>
        <h3 className="mb-[9px] text-[10px] font-bold text-[#3d526d]">Dashboard</h3>
        <div className="mb-[10px] grid grid-cols-4 gap-[5px] max-[520px]:grid-cols-2">
          <div className="rounded-[6px] border border-[#edf1f6] p-[6px]"><em className="mb-1 block text-[7px] not-italic text-[#5b99d3]">◈</em><small className="block text-[5px] text-[#91a0b2]">Total Medicines</small><b className="text-[9px] text-[#425a75]">5,320</b></div>
          <div className="rounded-[6px] border border-[#edf1f6] p-[6px]"><em className="mb-1 block text-[7px] not-italic text-[#3aab85]">✓</em><small className="block text-[5px] text-[#91a0b2]">Available Stocks</small><b className="text-[9px] text-[#425a75]">4,720</b></div>
          <div className="rounded-[6px] border border-[#edf1f6] p-[6px]"><em className="mb-1 block text-[7px] not-italic text-[#c28b35]">⚠</em><small className="block text-[5px] text-[#91a0b2]">Low Stock</small><b className="text-[9px] text-[#425a75]">280</b></div>
          <div className="rounded-[6px] border border-[#edf1f6] p-[6px]"><em className="mb-1 block text-[7px] not-italic text-[#c96763]">+</em><small className="block text-[5px] text-[#91a0b2]">Out of Stock</small><b className="text-[9px] text-[#425a75]">120</b></div>
        </div>
        <div className="grid grid-cols-[1.05fr_0.95fr] gap-[7px] max-[520px]:grid-cols-1">
          <div className="min-w-0 rounded-[7px] border border-[#edf1f6] p-[7px]"><b className="text-[6px] text-[#526983]">Stock Overview</b><span className="ml-2 text-[5px] text-[#91a0b2]">● Available <span className="text-[#d9ad5b]">●</span> Low Stock</span><div className="mt-2 flex h-[70px] items-end justify-around border-b border-[#edf1f6] bg-[linear-gradient(to_bottom,transparent_32%,#f0f3f7_33%,transparent_34%,transparent_65%,#f0f3f7_66%,transparent_67%)]">{[44, 69, 53, 78, 60, 73, 48].map((height, index) => <i className="w-[7px] rounded-t-sm bg-[#79b4e2]" style={{ height: `${height}%` }} key={index} />)}</div><div className="mt-1 flex justify-around text-[5px] text-[#9ca9b9]">Mon Tue Wed Thu Fri Sat Sun</div></div>
          <div className="min-w-0 rounded-[7px] border border-[#edf1f6] p-[7px]"><b className="text-[6px] text-[#526983]">Recent Activities</b>{activities.map(([name, detail, time, color]) => <div className="flex items-start gap-[5px] border-b border-[#f1f3f6] py-[6px] last:border-0" key={name}><i className={`mt-[2px] text-[5px] not-italic ${color === 'teal' ? 'text-[#3aab85]' : color === 'orange' ? 'text-[#cc9842]' : 'text-[#5b99d3]'}`}>●</i><span className="min-w-0 flex-1"><b className="block truncate text-[5px] text-[#536982]">{name}</b><small className="block text-[5px] text-[#9ca9b9]">{detail}</small></span><time className="text-[5px] text-[#a2afbd]">{time}</time></div>)}</div>
        </div>
      </section>
    </div>
  )
}

function PinnedFeatures({ reduceMotion }: { reduceMotion: boolean | null }) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section || reduceMotion) return

    const media = gsap.matchMedia()
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-feature-card]', section)
      const animation = gsap.fromTo(
        cards,
        { y: 28, opacity: 0.45 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top+=80',
            end: () => `+=${Math.round(Math.min(window.innerHeight * 0.45, 360))}`,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      )

      return () => {
        animation.scrollTrigger?.kill()
        animation.kill()
      }
    })

    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reduceMotion] })

  return (
    <section className={`${containerClass} py-[72px] max-[650px]:py-14`} id="features" ref={sectionRef}>
      <Reveal className="mb-7 max-w-[560px]"><p className="mb-2 text-[13px] font-bold tracking-[1.7px] text-[#6792b8]">KEY FEATURES</p><h2 className="m-0 text-[27px] font-bold leading-tight tracking-[-1px] text-[#2d4967] max-[650px]:text-[23px]">Everything You Need in One System</h2><p className="mt-2 text-[14px] leading-relaxed text-[#74869c]">Streamline your pharmacy operations with powerful features.</p></Reveal>
      <div className="grid grid-cols-5 gap-[11px] max-[1000px]:grid-cols-3 max-[650px]:grid-cols-2">{features.map(([icon, title, detail]) => <article className="min-h-[116px] rounded-[12px] border border-[#e5edf5] bg-white/70 p-[15px] shadow-[0_8px_24px_#385a7b08] backdrop-blur-md" data-feature-card key={title}><b className="mb-[11px] grid size-[29px] place-items-center rounded-[9px] bg-[#edf6ff] text-[13px] text-[#4c8fc9]">{icon}</b><span className="text-[14px] font-semibold leading-relaxed text-[#526983]">{title}<br />{detail}</span></article>)}</div>
    </section>
  )
}

function HomePage() {
  const reduceMotion = useReducedMotion()

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(ellipse_at_92%_10%,#e1f2ff_0,transparent_34rem),linear-gradient(180deg,#f8fbff_0%,#fff_60%)] text-[#263d58]">
      <motion.header
        className="sticky top-0 z-30 mx-auto flex h-[78px] w-full items-center justify-between border border-x-0 border-t-0 border-white/80 bg-white/75 px-[max(24px,calc((100vw-1200px)/2))] shadow-[0_9px_35px_#244b7010] backdrop-blur-xl max-[900px]:h-auto max-[900px]:min-h-[70px] max-[900px]:flex-wrap max-[900px]:gap-x-[14px] max-[900px]:gap-y-2 max-[900px]:px-[18px] max-[900px]:py-[11px] max-[650px]:min-h-[68px] max-[650px]:gap-[10px] max-[650px]:px-[14px]"
        initial={reduceMotion ? false : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <BrandLogo />
        <nav className="flex items-center gap-1 max-[900px]:order-3 max-[900px]:w-full max-[900px]:flex-[0_0_100%] max-[900px]:flex-wrap max-[900px]:justify-center max-[650px]:flex-nowrap max-[650px]:justify-between max-[650px]:gap-0">
          <motion.a className="rounded-full bg-[#eaf4ff] px-[13px] py-[10px] text-[13px] font-semibold text-[#337bc2] no-underline max-[900px]:px-[9px] max-[900px]:text-[14px] max-[650px]:px-[7px] max-[650px]:py-2 max-[650px]:text-[13px]" href="#home" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>Home</motion.a>
          <motion.a className="rounded-full px-[13px] py-[10px] text-[13px] font-semibold text-[#667b93] no-underline transition-colors hover:bg-[#eaf4ff] hover:text-[#337bc2] max-[900px]:px-[9px] max-[900px]:text-[14px] max-[650px]:px-[7px] max-[650px]:py-2 max-[650px]:text-[13px]" href="#features" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>Features</motion.a>
          <motion.a className="rounded-full px-[13px] py-[10px] text-[13px] font-semibold text-[#667b93] no-underline transition-colors hover:bg-[#eaf4ff] hover:text-[#337bc2] max-[900px]:px-[9px] max-[900px]:text-[14px] max-[650px]:px-[7px] max-[650px]:py-2 max-[650px]:text-[13px]" href="#benefits" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>Benefits</motion.a>
          <motion.a className="rounded-full px-[13px] py-[10px] text-[13px] font-semibold text-[#667b93] no-underline transition-colors hover:bg-[#eaf4ff] hover:text-[#337bc2] max-[900px]:px-[9px] max-[900px]:text-[14px] max-[650px]:px-[7px] max-[650px]:py-2 max-[650px]:text-[13px]" href="#about" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>About</motion.a>
          <motion.a className="rounded-full px-[13px] py-[10px] text-[13px] font-semibold text-[#667b93] no-underline transition-colors hover:bg-[#eaf4ff] hover:text-[#337bc2] max-[900px]:px-[9px] max-[900px]:text-[14px] max-[650px]:px-[7px] max-[650px]:py-2 max-[650px]:text-[13px]" href="#contact" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}>Contact</motion.a>
        </nav>
        <GlassActionLink href="#/login">Log in</GlassActionLink>
      </motion.header>

      <section className="grid min-h-[565px] grid-cols-[54%_46%] items-stretch overflow-hidden bg-[radial-gradient(ellipse_at_87%_35%,#d7efff_0,transparent_34rem),linear-gradient(120deg,#f4f9ff_0%,#eaf5ff_55%,#f8fbff_100%)] max-[900px]:min-h-[500px] max-[900px]:grid-cols-[56%_44%] max-[650px]:flex max-[650px]:flex-col" id="home">
        <Reveal className="relative z-[1] flex w-[min(650px,calc(100%-70px))] flex-col justify-center pb-[65px] pl-[max(32px,calc((100vw-1200px)/2))] pt-[75px] max-[900px]:pl-8 max-[650px]:mx-auto max-[650px]:w-[calc(100%-36px)] max-[650px]:pb-[34px] max-[650px]:pl-0 max-[650px]:pt-[55px]" direction="left">
          <p className="mb-[14px] text-[14px] font-extrabold tracking-[1.8px] text-[#4b91d2]">SMART PHARMACY MANAGEMENT</p>
          <h1 className="mb-[18px] mt-0 max-w-[700px] font-['Manrope'] text-[clamp(35px,4.2vw,58px)] font-bold leading-[1.13] tracking-[-2.7px] text-[#203d5c] max-[650px]:text-[clamp(29px,7vw,39px)] max-[650px]:tracking-[-1.5px]">Smart Pharmacy<br />Inventory Management<br />for a <span className="text-[#5599d6]">Healthier Tomorrow</span></h1>
          <p className="max-w-[460px] text-[14px] leading-[1.8] text-[#6a7f96] max-[650px]:text-[13px]">Track, manage, and monitor your hospital&apos;s medicine inventory with ease, accuracy, and real-time insights.</p>
          <div className="mt-[25px] flex flex-wrap gap-3">
            <motion.a className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-[14px] border border-white bg-white/85 px-[19px] text-[13px] font-bold text-[#2f73b5] no-underline shadow-[0_8px_24px_#3a6e9a14] backdrop-blur-2xl transition hover:border-[#d7ecff] hover:bg-white hover:shadow-[0_12px_30px_#3a6e9a20] motion-reduce:transition-none" href="#/register" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>Create your account <span className="text-[14px] text-[#72a8dc]">↗</span></motion.a>
            <motion.a className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-[14px] border border-white/80 bg-[#eaf4fc]/70 px-[19px] text-[13px] font-bold text-[#607f9d] no-underline shadow-[0_8px_24px_#3a6e9a14] backdrop-blur-2xl transition hover:border-[#d7ecff] hover:bg-white motion-reduce:transition-none" href="#about" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>Explore features <span className="text-[14px] text-[#72a8dc]">↓</span></motion.a>
          </div>
        </Reveal>
        <Reveal className="relative isolate min-h-[565px] overflow-hidden bg-[#d7eafa] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(90deg,#eaf5ff5c,transparent_45%),linear-gradient(0deg,#e1f0fc36,transparent_50%)] after:content-[''] max-[900px]:min-h-[500px] max-[650px]:min-h-[330px] max-[650px]:w-full" direction="right" delay={0.12}>
          <img className="absolute inset-0 size-full object-cover object-center saturate-[.72] brightness-[1.05]" src="https://www.amnhealthcare.com/siteassets/amn-insights/news-and-features/pharmacists_role.jpg" alt="Pharmacist holding medicine in a pharmacy" />
          <div className="absolute left-[22px] top-[74px] z-[2] grid gap-3 max-[650px]:left-[18px] max-[650px]:top-6 max-[650px]:gap-2">
            <div className="w-[164px] rounded-[15px] border border-white/85 bg-white/80 px-[15px] py-3 text-[14px] text-[#5797d2] shadow-[0_13px_35px_#31567c20] backdrop-blur-xl max-[650px]:w-[145px] max-[650px]:px-3 max-[650px]:py-[9px]">💊 <small className="ml-1 text-[13px] text-[#7d8fa3]">Total Medicines</small><b className="block pl-[25px] font-['Manrope'] text-[14px] text-[#2a4868]">5,320</b></div>
            <div className="w-[164px] rounded-[15px] border border-white/85 bg-white/80 px-[15px] py-3 text-[14px] text-[#5797d2] shadow-[0_13px_35px_#31567c20] backdrop-blur-xl max-[650px]:w-[145px] max-[650px]:px-3 max-[650px]:py-[9px]">✓ <small className="ml-1 text-[13px] text-[#7d8fa3]">Available Stocks</small><b className="block pl-[25px] font-['Manrope'] text-[14px] text-[#2a4868]">4,720</b></div>
            <div className="w-[164px] rounded-[15px] border border-white/85 bg-white/80 px-[15px] py-3 text-[14px] text-[#5797d2] shadow-[0_13px_35px_#31567c20] backdrop-blur-xl max-[650px]:w-[145px] max-[650px]:px-3 max-[650px]:py-[9px]">⚠ <small className="ml-1 text-[13px] text-[#7d8fa3]">Low Stock</small><b className="block pl-[25px] font-['Manrope'] text-[14px] text-[#2a4868]">280</b></div>
          </div>
        </Reveal>
      </section>

      <PinnedFeatures reduceMotion={reduceMotion} />

      <section className={`${containerClass} grid grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)] items-center gap-[54px] py-[25px] pb-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[30px] max-[650px]:py-[15px] max-[650px]:pb-[65px]`} id="about">
        <Reveal className="min-w-0" direction="left"><DashboardPreview /></Reveal>
        <Reveal className="min-w-0 max-[900px]:max-w-[520px]" direction="right"><p className="mb-[14px] text-[14px] font-extrabold tracking-[1.8px] text-[#4b91d2]">REAL-TIME OVERVIEW</p><h2 className="mb-[11px] mt-2 font-['Manrope'] text-[clamp(25px,3vw,34px)] font-bold leading-[1.2] tracking-[-1.2px] text-[#203d5c]">Stay Informed,<br />Always</h2><p className="text-[13px] leading-[1.8] text-[#73869d]">Get a complete view of your pharmacy inventory — from stock levels to expiration alerts — all in one intuitive dashboard.</p><ul className="mt-5 grid gap-[10px] p-0 text-[13px] leading-[2] text-[#627891]">{['Monitor stock availability', 'Track expiring medicines', 'Receive low-stock alerts'].map((item) => <li className="flex items-center gap-2" key={item}><span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#e8f4ff] text-[13px] text-[#4289ce]">✓</span>{item}</li>)}</ul></Reveal>
      </section>

      <section className="bg-[linear-gradient(180deg,#f1f8ff,#f8fbff)] py-[75px] pb-[82px] max-[650px]:py-[58px]" id="benefits">
        <Reveal className={`${containerClass} mb-7 text-center`}><p className="mb-[14px] text-[14px] font-extrabold tracking-[1.8px] text-[#4b91d2]">WHY CHOOSE MEDTRACK?</p><h2 className="mx-auto my-2 max-w-[650px] font-['Manrope'] text-[clamp(25px,3vw,34px)] font-bold leading-[1.2] tracking-[-1.2px] text-[#203d5c]">A Smarter Solution for Hospital Pharmacy</h2></Reveal>
        <motion.div className={`${containerClass} grid grid-cols-4 gap-[14px] max-[900px]:grid-cols-2 max-[650px]:gap-[10px]`} variants={staggerVariants} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
          {[['♢', 'Improve Accuracy', 'Reduce human errors with automated tracking.'], ['◷', 'Save Time', 'Manage inventory faster and more efficiently.'], ['✚', 'Prevent Shortages', 'Ensure essential medicines are always available.'], ['♥', 'Enhance Patient Care', 'A well-stocked pharmacy for better healthcare.']].map(([icon, title, text]) => <motion.article className="rounded-2xl border border-white bg-white/70 p-[25px_20px] shadow-[0_10px_26px_#31567c0a] backdrop-blur-md max-[650px]:p-[18px_13px]" key={title} variants={itemVariants} whileHover={reduceMotion ? undefined : { y: -4 }}><b className="inline-grid size-[42px] place-items-center rounded-[14px] bg-[#eaf4ff] text-[22px] text-[#528fc9]">{icon}</b><h3 className="mb-[7px] mt-3 font-['Manrope'] text-[14px] font-bold text-[#344f6d]">{title}</h3><p className="text-[14px] leading-[1.7] text-[#7b8da2]">{text}</p></motion.article>)}
        </motion.div>
      </section>

      <Reveal className={`${containerClass} relative z-[1] mb-[54px] mt-14 flex items-center gap-5 rounded-[22px] border border-white bg-[linear-gradient(120deg,#edf7ffeb,#ffffffeb)] px-[30px] py-[26px] text-[#344f6d] shadow-[0_14px_40px_#31567c12] backdrop-blur-2xl max-[650px]:mb-10 max-[650px]:mt-[35px] max-[650px]:flex-wrap max-[650px]:gap-[14px] max-[650px]:p-5`} id="contact"><div className="flex-1 max-[650px]:basis-full"><p className="mb-[5px] text-[14px] font-extrabold tracking-[1.8px] text-[#4b91d2]">READY TO GET STARTED?</p><h2 className="m-0 font-['Manrope'] text-base font-bold text-[#294762] max-[650px]:text-sm">A calmer way to manage your pharmacy.</h2><p className="mt-[5px] text-[14px] text-[#7d8fa3]">Create an account to see your inventory dashboard.</p></div><motion.a className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-[14px] border border-white bg-white/85 px-[19px] text-[13px] font-bold text-[#2f73b5] no-underline shadow-[0_8px_24px_#3a6e9a14] backdrop-blur-2xl transition hover:border-[#d7ecff] hover:bg-white hover:shadow-[0_12px_30px_#3a6e9a20] motion-reduce:transition-none" href="#/register" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>Create account <span className="text-[14px] text-[#72a8dc]">↗</span></motion.a></Reveal>
      <motion.footer
        className="border-t border-[#e8f0f8] bg-[#f5f9fd] pb-[19px] pt-11"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className={`${containerClass} grid grid-cols-[1.5fr_0.7fr_0.8fr] gap-10 pb-[35px] max-[900px]:grid-cols-[1.3fr_1fr_1fr] max-[650px]:grid-cols-2 max-[650px]:gap-x-[18px] max-[650px]:gap-y-[26px]`}>
          <div className="max-[650px]:col-span-full"><BrandLogo /><p className="mt-[14px] max-w-[255px] text-[13px] leading-[1.8] text-[#7b8da2]">Thoughtful tools for safer, more organized pharmacy inventory.</p></div>
          <div className="flex flex-col items-start gap-[11px]"><b className="mb-[3px] font-['Manrope'] text-[13px] text-[#3c5673]">Explore</b><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#home">Home</a><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#features">Features</a><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#about">Overview</a><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#benefits">Benefits</a></div>
          <div className="flex flex-col items-start gap-[11px]"><b className="mb-[3px] font-['Manrope'] text-[13px] text-[#3c5673]">Get started</b><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#/login">Log in</a><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#/register">Create account</a><a className="text-[14px] text-[#7c8da1] no-underline transition-colors hover:text-[#4389d5]" href="#contact">Contact</a></div>
        </div>
        <div className={`${containerClass} flex justify-between gap-4 border-t border-[#e3ebf3] pt-[17px] text-[13px] text-[#91a0b1] max-[650px]:flex-col max-[650px]:gap-[7px]`}><span>© 2026 MedTrack. All rights reserved.</span></div>
      </motion.footer>
    </main>
  )
}

export default HomePage
