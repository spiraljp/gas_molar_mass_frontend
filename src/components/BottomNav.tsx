import { mockOnly } from '../api/mode'
import { logout } from '../api/auth'
import { errorMessage } from '../api/errors'
import { useAppDispatch, useAppSelector } from '../store'
import { authStarted, authFailed, signedOut } from '../store/authSlice'
import { Navbar, Nav } from 'react-bootstrap'

interface BottomNavProps {
  path: string
}

function BottomNav({ path }: BottomNavProps) {
  const dispatch = useAppDispatch()
  const { user, status } = useAppSelector((state) => state.auth)
  const busy = useAppSelector((state) => state.gases.pending > 0) || status === 'loading'
  async function signOut() {
    dispatch(authStarted())
    try {
      await logout()
      dispatch(signedOut())
      window.location.hash = '/catalog'
    } catch (error) { dispatch(authFailed(errorMessage(error))) }
  }
  return (
    <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
      <Nav className="bottom-nav-items">
        <Nav.Link
          href="#/feed"
          disabled={busy}
          className="bottom-nav-link"
          active={path === '/feed'}
          aria-current={path === '/feed' ? 'page' : undefined}
        >
          Лента
        </Nav.Link>

        <Nav.Link href="#/create" disabled={mockOnly || !user || busy} active={path === '/create'} className="bottom-nav-link">
          Добавление
        </Nav.Link>

        <Nav.Link
          href="#/catalog"
          disabled={busy}
          className="bottom-nav-link"
          active={path === '/catalog'}
          aria-current={path === '/catalog' ? 'page' : undefined}
        >
          Плитка
        </Nav.Link>

        <Nav.Link href={user ? undefined : '#/login'} as={user ? 'button' : 'a'}
          disabled={mockOnly || busy} className="bottom-nav-link" active={path === '/login'}
          onClick={user ? () => { void signOut() } : undefined}>
          {user ? 'Выход' : 'Вход'}
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default BottomNav
