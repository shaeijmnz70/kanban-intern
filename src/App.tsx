import { useEffect, useState } from 'react'
import DashboardPage from './assets/pages/dashboard'
import HomePage from './assets/pages/home'
import LoginPage from './assets/pages/login'

function App() {
  const [route, setRoute] = useState(window.location.hash)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('medtrack-authenticated') === 'true',
  )

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = window.location.hash
      if (nextRoute === '#/logout') {
        sessionStorage.removeItem('medtrack-authenticated')
        sessionStorage.removeItem('medtrack-user-name')
        setIsAuthenticated(false)
        window.location.hash = '#home'
        return
      }

      setRoute(nextRoute)
      setIsAuthenticated(sessionStorage.getItem('medtrack-authenticated') === 'true')
    }

    const handleAuthentication = () => setIsAuthenticated(true)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('medtrack-authenticated', handleAuthentication)

    if (window.location.hash === '#/logout') handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('medtrack-authenticated', handleAuthentication)
    }
  }, [])

  if (route === '#/login' || route === '#/register') {
    return <LoginPage mode={route === '#/register' ? 'register' : 'login'} />
  }

  if (route === '#/dashboard') {
    return isAuthenticated ? <DashboardPage /> : <LoginPage mode="login" />
  }

  return <HomePage />
}

export default App
