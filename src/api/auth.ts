import axios from 'axios'
import { mockOnly } from './mode'
// No thunk or generated code for authentication. HttpOnly cookie is set by FastAPI.
const authHttp = axios.create({ baseURL: '/api/users', withCredentials: true, timeout: 10000 })
export const login = (username: string, password: string) => {
  if (mockOnly) return Promise.reject(new Error('На GitHub Pages доступен только гостевой mock-режим'))
  return authHttp.post<{ current_user_id: number }>('/login', { username, password })
}
export const logout = () => mockOnly
  ? Promise.reject(new Error('На GitHub Pages доступен только гостевой mock-режим'))
  : authHttp.post('/logout')
