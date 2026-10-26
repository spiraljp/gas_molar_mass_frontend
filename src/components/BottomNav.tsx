import { Navbar, Nav } from 'react-bootstrap'

interface BottomNavProps {
  path: string
}

function BottomNav({ path }: BottomNavProps) {
  return (
    <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
      <Nav className="bottom-nav-items">
        <Nav.Link
          href="#/feed"
          className="bottom-nav-link"
          active={path === '/feed'}
          aria-current={path === '/feed' ? 'page' : undefined}
        >
          Лента
        </Nav.Link>

        <Nav.Link disabled className="bottom-nav-link">
          Добавление
        </Nav.Link>

        <Nav.Link
          href="#/catalog"
          className="bottom-nav-link"
          active={path === '/catalog'}
          aria-current={path === '/catalog' ? 'page' : undefined}
        >
          Плитка
        </Nav.Link>

        <Nav.Link disabled className="bottom-nav-link">
          Вход
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default BottomNav
