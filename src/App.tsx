import { useEffect, useState } from 'react'
import AdminDashboard from './admin/admin db'
import ClientDashboard from './assets/pages/client'
import DashboardPage from './assets/pages/dashboard'
import HomePage from './assets/pages/home'
import LoginPage from './assets/pages/login'

function App() {
  const [route, setRoute] = useState(window.location.hash)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('medtrack-authenticated') === 'true',
  )

  useEffect(() => {
    const clearAuthentication = () => {
      sessionStorage.removeItem('medtrack-authenticated')
      sessionStorage.removeItem('medtrack-user-name')
      sessionStorage.removeItem('medtrack-user-role')
      setIsAuthenticated(false)
    }

    const handleHashChange = () => {
      const nextRoute = window.location.hash
      if (nextRoute === '#/logout') {
        clearAuthentication()
        window.location.hash = '#home'
        return
      }

      if (nextRoute === '#/login' || nextRoute === '#/register') {
        clearAuthentication()
      }

      setRoute(nextRoute)
    }

    const handleAuthentication = () => setIsAuthenticated(true)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('medtrack-authenticated', handleAuthentication)

    if (['#/logout', '#/login', '#/register'].includes(window.location.hash)) {
      handleHashChange()
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('medtrack-authenticated', handleAuthentication)
    }
  }, [])

  const role = sessionStorage.getItem('medtrack-user-role')

  if (route === '#/client') {
    return isAuthenticated && role === 'user' ? <ClientDashboard /> : <LoginPage mode="login" />
  }

  if (route === '#/admin') {
    return isAuthenticated && role === 'admin' ? <AdminDashboard /> : <LoginPage mode="login" />
  }

  if (route === '#/dashboard') {
    return isAuthenticated && role === 'user' ? <DashboardPage /> : <LoginPage mode="login" />
  }

  if (route === '#/login' || route === '#/register') {
    return <LoginPage mode={route === '#/register' ? 'register' : 'login'} />
  }

  return <HomePage />
}

export default App
