import type { FormEvent } from 'react'
import './login.css'

type AuthMode = 'login' | 'register'

function Logo() {
  return (
    <div className="auth-logo">
      <strong>✚</strong>
      <span><b>Med</b>Track<small>Pharmacy Inventory System</small></span>
    </div>
  )
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className={`auth-page ${isRegister ? 'register-page' : 'login-page'}`}>
      <section className="auth-visual">
        <Logo />
        <div className="visual-copy">
          <h1>{isRegister ? 'Create Account' : 'Welcome Back!'}</h1>
          <p>{isRegister ? 'Fill in the details below to get started.' : 'Sign in to your account to continue managing your pharmacy inventory.'}</p>
        </div>
        <div className="visual-photo" />
        {isRegister && <div className="visual-benefits"><b>✓　Secure Access</b><small>Your data is safe with us.</small><b>ϟ　Efficient Management</b><small>Track inventory in real-time.</small><b>♥　Better Patient Care</b><small>Never run out of essential medicines.</small></div>}
      </section>

      <section className="auth-panel">
        <div className="auth-tabs"><a className={isRegister ? 'active' : ''} href="#/register">♟　Register</a><a className={!isRegister ? 'active' : ''} href="#/login">➜　Login</a></div>
        <div className="auth-heading"><h2>{isRegister ? 'Create Account' : 'Login'}</h2><p>{isRegister ? 'Fill in the details below to get started.' : 'Access your account'}</p></div>
        <form onSubmit={handleSubmit}>
          {isRegister && <label>♟<input required placeholder="Full Name" /></label>}
          <label>✉<input required type={isRegister ? 'email' : 'text'} placeholder={isRegister ? 'Email Address' : 'Email or Username'} /></label>
          <label>▣<input required type="password" placeholder="Password" /><span>◉</span></label>
          {isRegister && <label>▣<input required type="password" placeholder="Confirm Password" /><span>◉</span></label>}
          {isRegister && <label>♟<select required defaultValue=""><option value="" disabled>Select Role</option><option>Administrator</option><option>Pharmacist</option><option>Staff</option></select></label>}
          {!isRegister && <div className="remember"><label><input type="checkbox" /> Remember me</label><a href="#/login">Forgot password?</a></div>}
          <button type="submit">{isRegister ? 'Create Account　➜' : 'Login　➜'}</button>
        </form>
        <div className="or"><span>or</span></div>
        <button className="google" type="button"><b>G</b> {isRegister ? 'Sign up' : 'Continue'} with Google</button>
        <p className="auth-switch">{isRegister ? 'Already have an account?' : 'Don’t have an account?'} <a href={isRegister ? '#/login' : '#/register'}>{isRegister ? 'Login' : 'Register'}</a></p>
      </section>
    </main>
  )
}
