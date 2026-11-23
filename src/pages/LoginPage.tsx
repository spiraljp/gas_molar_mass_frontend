import { useState, type FormEvent } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { login } from '../api/auth'
import { errorMessage } from '../api/errors'
import { useAppDispatch, useAppSelector } from '../store'
import { authStarted, signedIn, authFailed } from '../store/authSlice'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((state) => state.auth)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(authStarted())
    try {
      const { data } = await login(username, password)
      dispatch(signedIn({ id: data.current_user_id, username }))
      window.location.hash = '/catalog'
    } catch (err) { dispatch(authFailed(errorMessage(err))) }
  }
  return <Container as="main" className="app-screen">
    <h1 className="page-title">Вход</h1>
    {user ? <p>Вы вошли как {user.username}</p> : <Form className="auth-form" onSubmit={submit}>
      <Form.Group controlId="username"><Form.Label>Имя пользователя</Form.Label>
        <Form.Control required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
      </Form.Group>
      <Form.Group controlId="password"><Form.Label>Пароль</Form.Label>
        <Form.Control required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </Form.Group>
      {error && <p role="alert" className="text-danger">{error}</p>}
      <Button type="submit" disabled={status === 'loading'}>Войти</Button>
    </Form>}
  </Container>
}
