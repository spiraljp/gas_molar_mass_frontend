import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Api, type BodyApiCreateGasApiGasesPost, type GasPublishRequest } from '../api/generated/Api'
import { errorMessage, unavailable } from '../api/errors'
import { mockGases } from '../mocks/gases'
import type { Gas } from '../types/gas'
import type { RootState } from './index'
import { signedIn, signedOut } from './authSlice'
import { mockOnly } from '../api/mode'

const gasApi = new Api({ withCredentials: true, timeout: 10000 }).api
type ThunkConfig = { state: RootState; rejectValue: string }
interface GasesState {
  search: string
  items: Gas[]
  details: Gas | null
  feed: Gas | null
  draft: Gas | null
  source: 'api' | 'mock' | null
  pending: number
  error: string | null
  catalogRequest: string | null
}
const initialState: GasesState = {
  search: '', items: [], details: null, feed: null, draft: null, source: null,
  pending: 0, error: null, catalogRequest: null,
}
function guestGas(gas: Gas, authenticated: boolean): Gas {
  return authenticated ? gas : { ...gas, is_owner: 0, is_liked: 0 }
}
export const fetchGases = createAsyncThunk<
  { items: Gas[]; source: 'api' | 'mock' }, void, ThunkConfig
>('gases/fetchGases', async (_, { getState, rejectWithValue }) => {
  const { gases: { search }, auth: { user } } = getState()
  if (mockOnly) return {
    items: mockGases.filter((gas) => gas.gas_name.toLowerCase().includes(search.trim().toLowerCase()))
      .map((gas) => guestGas(gas, false)), source: 'mock',
  }
  try {
    const { data } = await gasApi.apiGetGasesApiGasesGet({ search: search.trim() })
    return { items: data.map((gas) => guestGas(gas, !!user)), source: 'api' }
  } catch (error) {
    if (!user && unavailable(error)) {
      return { items: mockGases.filter((gas) => gas.gas_name.toLowerCase().includes(search.trim().toLowerCase()))
        .map((gas) => guestGas(gas, false)), source: 'mock' }
    }
    return rejectWithValue(errorMessage(error))
  }
})
export const fetchGasFeed = createAsyncThunk<
  { gas: Gas; source: 'api' | 'mock' }, { id?: number; next?: boolean }, ThunkConfig
>('gases/fetchGasFeed', async (query, { getState, rejectWithValue }) => {
  const user = getState().auth.user
  if (mockOnly) {
    const index = mockGases.findIndex((gas) => gas.id === query.id)
    const gas = mockGases[query.next ? (index + 1) % mockGases.length : Math.max(0, index)]
    return { gas: guestGas(gas, false), source: 'mock' }
  }
  try {
    const { data } = await gasApi.apiGetFeedApiGasesFeedGet({ gas_id: query.id, next: query.next })
    return { gas: guestGas({ ...data, gas_image_url: null, is_owner: 0 }, !!user), source: 'api' }
  } catch (error) {
    if (!user && unavailable(error)) {
      const index = mockGases.findIndex((gas) => gas.id === query.id)
      const gas = mockGases[query.next ? (index + 1) % mockGases.length : Math.max(0, index)]
      return { gas: guestGas(gas, false), source: 'mock' }
    }
    return rejectWithValue(errorMessage(error))
  }
})
// The backend has no details endpoint: read its catalog without changing the Redux filter.
export const fetchGasDetails = createAsyncThunk<
  { gas: Gas; source: 'api' | 'mock' }, number, ThunkConfig
>('gases/fetchGasDetails', async (id, { getState, rejectWithValue }) => {
  const user = getState().auth.user
  const fromMock = () => {
    const gas = mockGases.find((item) => item.id === id)
    return gas ? { gas: guestGas(gas, false), source: 'mock' as const } : null
  }
  if (mockOnly) return fromMock() || rejectWithValue('Газ не найден')
  try {
    const { data } = await gasApi.apiGetGasesApiGasesGet()
    const gas = data.find((item) => item.id === id)
    return gas ? { gas: guestGas(gas, !!user), source: 'api' } : rejectWithValue('Газ не найден')
  } catch (error) {
    if (!user && unavailable(error)) return fromMock() || rejectWithValue('Газ не найден')
    return rejectWithValue(errorMessage(error))
  }
})
export const fetchGasDraft = createAsyncThunk<Gas | null, void, ThunkConfig>(
  'gases/fetchGasDraft', async (_, { getState, rejectWithValue }) => {
    if (mockOnly || !getState().auth.user) return rejectWithValue('Войдите для работы с черновиком')
    try {
      const { data } = await gasApi.apiGetDraftApiGasesDraftGet()
      return { ...data, is_owner: 1, likes_count: 0 }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      return rejectWithValue(errorMessage(error))
    }
  },
)
export const createGas = createAsyncThunk<Gas, BodyApiCreateGasApiGasesPost, ThunkConfig>(
  'gases/createGas', async (data, { getState, rejectWithValue }) => {
    if (mockOnly || !getState().auth.user) return rejectWithValue('Войдите для добавления газа')
    try {
      const response = await gasApi.apiCreateGasApiGasesPost(data)
      return { ...response.data, is_owner: 1, likes_count: 0 }
    } catch (error) { return rejectWithValue(errorMessage(error)) }
  },
)
export const publishGas = createAsyncThunk<number, { id: number; data: GasPublishRequest }, ThunkConfig>(
  'gases/publishGas', async ({ id, data }, { getState, rejectWithValue }) => {
    if (mockOnly || !getState().auth.user) return rejectWithValue('Требуется вход')
    try { await gasApi.apiPublishGasApiGasesGasIdPublishPut(id, data); return id }
    catch (error) { return rejectWithValue(errorMessage(error)) }
  },
)
export const deleteGas = createAsyncThunk<number, number, ThunkConfig>(
  'gases/deleteGas', async (id, { getState, rejectWithValue }) => {
    if (mockOnly || !getState().auth.user) return rejectWithValue('Требуется вход')
    try { await gasApi.apiDeleteGasApiGasesGasIdDelete(id); return id }
    catch (error) { return rejectWithValue(errorMessage(error)) }
  },
)
export const toggleGasLike = createAsyncThunk<
  { id: number; liked: number; count: number }, number, ThunkConfig
>('gases/toggleGasLike', async (id, { getState, rejectWithValue }) => {
  if (mockOnly || !getState().auth.user) return rejectWithValue('Войдите, чтобы поставить лайк')
  try {
    // Catalog schema omits is_liked; the feed endpoint provides its current value.
    const { data: before } = await gasApi.apiGetFeedApiGasesFeedGet({ gas_id: id })
    const liked = before.is_liked ? 0 : 1
    await gasApi.apiSetLikeApiGasesGasIdLikePost(id, { value: liked })
    const { data: after } = await gasApi.apiGetFeedApiGasesFeedGet({ gas_id: id })
    return { id, liked: after.is_liked, count: after.likes_count }
  } catch (error) { return rejectWithValue(errorMessage(error)) }
})
const tasks = [fetchGases, fetchGasDetails, fetchGasFeed, fetchGasDraft, createGas, publishGas, deleteGas, toggleGasLike]
export const gasesSlice = createSlice({
  name: 'gases', initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload },
    clearGasError(state) { state.error = null },
  },
  extraReducers(builder) {
    builder
      .addCase(signedOut, () => initialState)
      .addCase(signedIn, () => initialState)
      .addCase(fetchGases.pending, (state, action) => { state.catalogRequest = action.meta.requestId })
      .addCase(fetchGases.fulfilled, (state, action) => {
        if (state.catalogRequest !== action.meta.requestId) return
        state.items = action.payload.items; state.source = action.payload.source
      })
      .addCase(fetchGases.rejected, (state, action) => {
        if (state.catalogRequest === action.meta.requestId) state.items = []
      })
      .addCase(fetchGasDetails.pending, (state) => { state.details = null })
      .addCase(fetchGasDetails.fulfilled, (state, action) => {
        state.details = action.payload.gas; state.source = action.payload.source
      })
      .addCase(fetchGasFeed.fulfilled, (state, action) => {
        state.feed = action.payload.gas; state.source = action.payload.source
      })
      .addCase(fetchGasFeed.rejected, (state) => { state.feed = null })
      .addCase(fetchGasDraft.fulfilled, (state, action) => { state.draft = action.payload })
      .addCase(createGas.fulfilled, (state, action) => { state.draft = action.payload })
      .addCase(publishGas.fulfilled, (state) => { state.draft = null })
      .addCase(deleteGas.fulfilled, (state, action) => {
        state.items = state.items.filter((gas) => gas.id !== action.payload)
        if (state.details?.id === action.payload) state.details = null
        if (state.draft?.id === action.payload) state.draft = null
        if (state.feed?.id === action.payload) state.feed = null
      })
      .addCase(toggleGasLike.fulfilled, (state, { payload }) => {
        for (const gas of [...state.items, state.feed, state.details]) {
          if (gas?.id === payload.id) { gas.likes_count = payload.count; gas.is_liked = payload.liked }
        }
      })
      .addMatcher((action) => tasks.some((task) => task.pending.match(action)), (state) => {
        state.pending++; state.error = null
      })
      .addMatcher((action) => tasks.some((task) => task.fulfilled.match(action)), (state) => {
        state.pending = Math.max(0, state.pending - 1)
      })
      .addMatcher((action) => tasks.some((task) => task.rejected.match(action)), (state, action) => {
        state.pending = Math.max(0, state.pending - 1)
        state.error = (action as { payload?: string }).payload || 'Ошибка запроса'
      })
  },
})
export const { setSearch, clearGasError } = gasesSlice.actions
