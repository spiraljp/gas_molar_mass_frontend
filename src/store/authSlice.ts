import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
interface AuthState {
  user: { id: number; username: string } | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  error: string | null
}
const initialState: AuthState = { user: null, status: 'idle', error: null }
export const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    authStarted(state) { state.status = 'loading'; state.error = null },
    signedIn(state, action: PayloadAction<NonNullable<AuthState['user']>>) {
      state.user = action.payload; state.status = 'authenticated'; state.error = null
    },
    signedOut: () => initialState,
    authFailed(state, action: PayloadAction<string>) {
      state.status = 'error'; state.error = action.payload
    },
  },
})
export const { authStarted, signedIn, signedOut, authFailed } = authSlice.actions
