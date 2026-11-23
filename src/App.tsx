import { mockOnly } from './api/mode'
import GasDetailsPage from './pages/GasDetailsPage'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import BottomNav from './components/BottomNav'
import CatalogPage from './pages/CatalogPage'
import FeedPage from './pages/FeedPage'
import './App.css'
import LoginPage from './pages/LoginPage'
import CreateGasPage from './pages/CreateGasPage'
import { useAppSelector } from './store'

function getPath() {
  const path = window.location.hash.slice(1)
  if (/^\/gas\/\d+$/.test(path)) return path
  return ['/catalog', '/feed', '/login', '/create'].includes(path) ? path : '/catalog'
}

function App() {
  const [path, setPath] = useState(getPath)
  const { pending, error, source } = useAppSelector((state) => state.gases)
  const { status: authStatus, error: authError } = useAppSelector((state) => state.auth)
  const authBusy = authStatus === 'loading'
  const busy = pending > 0 || authBusy

  useEffect(() => {
    function handleHashChange() {
      setPath(getPath())
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const detailsMatch = path.match(/^\/gas\/(\d+)$/)
  let page

  if (path === '/catalog') {
    page = <CatalogPage />
  } else if (path === '/feed') {
    page = <FeedPage />
  } else if (path === '/login') {
    page = <LoginPage />
  } else if (path === '/create') {
    page = <CreateGasPage />
  } else if (detailsMatch) {
    page = <GasDetailsPage gasId={Number(detailsMatch[1])} />
  } else {
    page = <CatalogPage />
  }

  return (
    <>
      {source === 'mock' && <div className="app-notice" role="status">{mockOnly ? 'Демонстрационные данные' : 'Сервис недоступен. Показаны демонстрационные данные для гостя.'}</div>}
      {authError && path !== '/login' && <div className="app-notice app-error" role="alert">{authError}</div>}
      {error && <div className="app-notice app-error" role="alert">{error}</div>}
      <div inert={busy}>{page}</div>
      {busy && <div className="request-overlay" role="status" aria-live="polite"><Spinner animation="border" /><span>Загрузка…</span></div>}
      <BottomNav path={path} />
    </>
  )
}

export default App
