import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import BottomNav from './components/BottomNav'
import CatalogPage from './pages/CatalogPage'
import FeedPage from './pages/FeedPage'
import GasDetailsPage from './pages/GasDetailsPage'
import './App.css'

function getPath() {
  return window.location.hash.slice(1) || '/catalog'
}

function App() {
  const [path, setPath] = useState(getPath)

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
  } else if (detailsMatch) {
    page = <GasDetailsPage gasId={Number(detailsMatch[1])} />
  } else {
    page = (
      <Container as="main" className="app-screen">
        <h1 className="page-title">Страница не найдена</h1>
        <a href="#/catalog">Вернуться в каталог</a>
      </Container>
    )
  }

  return (
    <>
      {page}
      <BottomNav path={path} />
    </>
  )
}

export default App
