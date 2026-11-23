import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import BrandLogo from '../../components/BrandLogo'
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle'

type AuthMode = 'login' | 'register'
const strongPasswordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{10,64}'
const authPageClassName = 'relative grid min-h-screen grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-[clamp(24px,4vw,72px)] overflow-hidden bg-gradient-to-br from-[#f8fbff] to-[#f0f6fc] px-[clamp(20px,5vw,76px)] py-6 font-sans text-[#2a4260] max-[900px]:gap-6 max-[900px]:px-[22px] max-[700px]:flex max-[700px]:flex-col max-[700px]:items-center max-[700px]:gap-0 max-[700px]:px-[14px] max-[700px]:pt-[14px] max-[700px]:pb-7'
const authFieldClassName = 'flex min-h-12 items-center gap-2.5 rounded-xl border border-[#e3ebf4] bg-white/70 px-[13px] text-[#7d91a7] transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-[#93c1e8] focus-within:bg-white focus-within:shadow-[0_0_0_3px_#8db9df24] motion-reduce:transition-none'
const authInputClassName = 'w-full min-w-0 border-0 bg-transparent text-[13px] text-[#2d4865] outline-none placeholder:text-[#9aa9b9]'

function LoginPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register'
  const reduceMotion = useReducedMotion()
  const [submittingMode, setSubmittingMode] = useState<AuthMode | null>(null)
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const submitTimer = useRef<number | null>(null)
  const isSubmitting = submittingMode === mode

  useEffect(() => () => {
    if (submitTimer.current !== null) window.clearTimeout(submitTimer.current)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get('fullName') ?? '').trim()
    if (isRegister && fullName.length < 2) {
      setFormError('Enter your full name using at least two characters.')
      return
    }

    if (isRegister && formData.get('password') !== formData.get('confirmPassword')) {
      const confirmPassword = event.currentTarget.elements.namedItem('confirmPassword')
      if (confirmPassword instanceof HTMLInputElement) {
        confirmPassword.setCustomValidity('Passwords do not match.')
        confirmPassword.reportValidity()
      }
      setFormError('Your passwords do not match.')
      return
    }

    setFormError('')
    const email = String(formData.get('username') ?? '').trim()
    const accountName = isRegister
      ? fullName
      : email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    setSubmittingMode(mode)
    submitTimer.current = window.setTimeout(() => {
      sessionStorage.setItem('medtrack-authenticated', 'true')
      sessionStorage.setItem('medtrack-user-name', accountName || 'Jane Doe')
      window.dispatchEvent(new Event('medtrack-authenticated'))
      window.location.hash = '#/dashboard'
      submitTimer.current = null
    }, reduceMotion ? 180 : 650)
  }

  function preventSwitchWhileSubmitting(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isSubmitting) event.preventDefault()
    else {
      setFormError('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <motion.main
      layout
      className={authPageClassName}
      transition={{ layout: layoutTransition }}
    >
      <motion.section
        className={`relative isolate row-start-1 h-[min(600px,calc(100vh-48px))] min-h-[460px] w-full min-w-0 overflow-hidden rounded-[30px] border border-white/70 bg-[#d3e6f7] shadow-[0_25px_70px_#264d721c] max-[900px]:min-h-[400px] max-[700px]:order-0 max-[700px]:h-[200px] max-[700px]:min-h-[200px] max-[700px]:flex-none max-[700px]:rounded-[22px] ${isRegister ? 'col-start-2' : 'col-start-1'}`}
        layout
        transition={{ layout: layoutTransition }}
      >
        <a className="absolute left-9 top-[34px] z-[3] inline-flex no-underline max-[700px]:left-5 max-[700px]:top-[18px]" href="#home" aria-label="MedTrack home">
          <BrandLogo variant="auth" />
        </a>
        <div className="absolute bottom-[142px] left-[9%] right-[9%] z-[2] max-w-[490px] max-[700px]:bottom-6 max-[700px]:left-5 max-[700px]:right-5">
          <h1 className="my-3 font-['Manrope'] text-[clamp(30px,3.2vw,45px)] font-bold leading-[1.12] tracking-[-1.5px] text-white max-[700px]:my-[6px] max-[700px]:max-w-[390px] max-[700px]:text-[23px]">
            {isRegister ? 'A healthier inventory starts here.' : 'Welcome back to a clearer view.'}
          </h1>
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#d3e6f7]" aria-hidden="true">
          <AnimatePresence initial={false} mode="sync">
            <motion.img
              key={mode}
              src={isRegister ? '/Men.jpg' : '/female.avif'}
              alt=""
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
              transition={reduceMotion
                ? { duration: 0.15 }
                : {
                    opacity: { duration: 0.9, ease: 'easeInOut' },
                    scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                  }}
              className={`absolute h-full w-full object-cover object-center will-change-transform ${isRegister ? 'object-[68%_center]' : ''}`}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#eff7ff24] via-[#3560850a] to-[#1c3e6078]" />
      </motion.section>

      <motion.section
        className={`row-start-1 min-w-0 w-full max-w-[470px] justify-self-center rounded-[26px] border border-white bg-[#ffffffd9] p-[clamp(25px,3.4vw,42px)] shadow-[0_22px_65px_#284f7416] backdrop-blur-[20px] max-[900px]:px-6 max-[900px]:py-7 max-[700px]:order-1 max-[700px]:-mt-5 max-[700px]:w-[calc(100%-12px)] max-[700px]:max-w-[510px] max-[700px]:rounded-[20px] max-[700px]:px-[21px] max-[700px]:py-[25px] ${isRegister ? 'col-start-1' : 'col-start-2'}`}
        layout
        transition={{ layout: layoutTransition }}
      >
        <div className="mb-[22px]">
          <h2 className="m-0 font-['Manrope'] text-[25px] font-bold tracking-[-0.8px] text-[#243f5c] max-[700px]:text-[22px]">
            {isRegister ? 'Create your account' : 'Sign in to MedTrack'}
          </h2>
        </div>

        <div className="relative mb-[22px] grid grid-cols-2 gap-1 rounded-[13px] border border-[#e8eff7] bg-[#f1f6fc] p-1" role="tablist" aria-label="Account access">
          <motion.span
            className={`absolute inset-y-1 z-0 w-[calc(50%-4px)] rounded-[9px] border border-white bg-white shadow-[0_4px_12px_#345d8012] transition-[left] duration-300 motion-reduce:transition-none ${isRegister ? 'left-[calc(50%+2px)]' : 'left-1'}`}
            layoutId="auth-tab-indicator"
            transition={{ layout: layoutTransition }}
          />
          <a
            className={`relative z-10 grid min-h-[37px] place-items-center rounded-[9px] text-[14px] font-semibold no-underline transition-colors motion-reduce:transition-none ${!isRegister ? 'text-[#367aba]' : 'text-[#7c8da1]'} ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}
            href="#/login"
            role="tab"
            aria-selected={!isRegister}
            aria-disabled={isSubmitting}
            onClick={preventSwitchWhileSubmitting}
          >
            Log in
          </a>
          <a
            className={`relative z-10 grid min-h-[37px] place-items-center rounded-[9px] text-[14px] font-semibold no-underline transition-colors motion-reduce:transition-none ${isRegister ? 'text-[#367aba]' : 'text-[#7c8da1]'} ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}
            href="#/register"
            role="tab"
            aria-selected={isRegister}
            aria-disabled={isSubmitting}
            onClick={preventSwitchWhileSubmitting}
          >
            Create account
          </a>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="min-h-[250px]"
            key={mode}
            initial={reduceMotion ? false : { opacity: 0, x: isRegister ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: isRegister ? -28 : 28 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.3, ease: 'easeOut' }}
          >
            <form className="grid gap-[11px]" onSubmit={handleSubmit}>
              {isRegister && (
                <label className={authFieldClassName}>
                  <input className={authInputClassName} autoComplete="name" name="fullName" required minLength={2} maxLength={80} placeholder="Full name" onInput={() => setFormError('')} />
                </label>
              )}
              <label className={authFieldClassName}>
                <input className={authInputClassName} autoComplete="username" name="username" required maxLength={254} type="email" placeholder="Email address" onInput={() => setFormError('')} />
              </label>
              <label className={authFieldClassName}>
                <input
                  className={authInputClassName}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  name="password"
                  required
                  minLength={isRegister ? 10 : 8}
                  maxLength={64}
                  pattern={isRegister ? strongPasswordPattern : undefined}
                  title={isRegister ? 'Use 10–64 characters with uppercase and lowercase letters, a number, and a symbol.' : undefined}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  onInput={() => setFormError('')}
                />
                <PasswordVisibilityToggle label="password" visible={showPassword} onToggle={() => setShowPassword((shown) => !shown)} />
              </label>
              {isRegister && (
                <>
                  <p className="-mb-1 -mt-1 mx-0.5 text-[14px] leading-[1.5] text-[#8d9daf]">Use 10+ characters with uppercase, lowercase, a number, and a symbol.</p>
                  <label className={authFieldClassName}>
                    <input
                      className={authInputClassName}
                      autoComplete="new-password"
                      name="confirmPassword"
                      required
                      minLength={10}
                      maxLength={64}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      onInput={(event) => {
                        event.currentTarget.setCustomValidity('')
                        setFormError('')
                      }}
                    />
                    <PasswordVisibilityToggle label="confirmation password" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((shown) => !shown)} />
                  </label>
                  <label className={authFieldClassName}>
                    <select className={`${authInputClassName} appearance-none invalid:text-[#9aa9b9]`} name="role" required defaultValue="">
                      <option value="" disabled>Select your role</option>
                      <option>Administrator</option>
                      <option>Pharmacist</option>
                      <option>Staff</option>
                    </select>
                    <span className="pointer-events-none text-[#8ca0b5]" aria-hidden="true">⌄</span>
                  </label>
                </>
              )}
              {formError && <p className="m-0 text-[13px] leading-[1.5] text-[#b94d4b]" role="alert">{formError}</p>}
              {!isRegister && (
                <div className="my-[2px] flex items-center text-[14px] text-[#7c8da1]">
                  <label className="inline-flex cursor-pointer items-center gap-[7px]">
                    <input className="peer sr-only" type="checkbox" />
                    <span className="grid size-4 place-items-center rounded-[4px] border border-[#cbd8e6] bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4389d5] peer-checked:[&>svg]:opacity-100" aria-hidden="true">
                      <svg className="size-3 text-[#4389d5] opacity-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Remember me
                  </label>
                </div>
              )}
              <motion.button
                className="mt-[3px] flex min-h-[47px] items-center justify-center gap-[9px] rounded-xl border border-[#8bb9e3] bg-gradient-to-r from-[#65a6dc] to-[#4a8fd0] text-[13px] font-bold text-white shadow-[0_8px_18px_#3a7db82a] transition-[box-shadow,filter] duration-200 hover:saturate-110 hover:shadow-[0_11px_22px_#3a7db83b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4389d5] disabled:cursor-wait disabled:opacity-90 motion-reduce:transition-none"
                type="submit"
                disabled={isSubmitting}
                whileHover={reduceMotion || isSubmitting ? undefined : { y: -2 }}
                whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.985 }}
              >
                {isSubmitting && <motion.span className="size-[14px] rounded-full border-2 border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />}
                {isSubmitting ? (isRegister ? 'Creating your account…' : 'Signing you in…') : (isRegister ? 'Create account' : 'Log in')}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </motion.button>
            </form>
            <p className="mb-0 mt-[14px] text-center text-[13px] text-[#9aa9b8]">Demo only. Details are not verified by a server.</p>
            <p className="mb-0 mt-[17px] text-center text-[14px] text-[#8292a5]">
              {isRegister ? 'Already have an account?' : 'New to MedTrack?'}{' '}
              <a className="font-bold text-[#4388c9] no-underline hover:text-[#2d6fab]" href={isRegister ? '#/login' : '#/register'} onClick={preventSwitchWhileSubmitting}>
                {isRegister ? 'Log in' : 'Create an account'}
              </a>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </motion.main>
  )
}

export default LoginPage
