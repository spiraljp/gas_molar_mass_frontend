import { beforeEach, describe, expect, it } from 'vitest'
import axios, { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'

let handler: AxiosAdapter
const requests: InternalAxiosRequestConfig[] = []
// Exercise the generated client and real Axios serialization without external services.
axios.defaults.adapter = (config) => { requests.push(config); return handler(config) }
const { store } = await import('../src/store')
const actions = await import('../src/store/gasesSlice')
const auth = await import('../src/store/authSlice')
const sample = {
  id: 27, gas_name: 'Азот', gas_formula: 'N2', short_description: 'Тест',
  gas_image_url: 'http://localhost:9000/gas-media/nitrogen.png', gas_video_url: null,
  molar_mass: 28, density_normal_conditions: 1.25, likes_count: 4, is_owner: 1,
}
function response(config: InternalAxiosRequestConfig, data: unknown) {
  return Promise.resolve({ data, status: 200, statusText: 'OK', headers: new AxiosHeaders(), config })
}
function failure(config: InternalAxiosRequestConfig, status?: number) {
  return Promise.reject(new AxiosError('Unavailable', 'ERR_NETWORK', config, undefined,
    status ? { data: { detail: 'Server error' }, status, statusText: 'Error', headers: new AxiosHeaders(), config } : undefined))
}
beforeEach(() => {
  store.dispatch(auth.signedOut())
  requests.length = 0
  handler = (config) => response(config, [sample])
})
describe('gas API and Redux integration', () => {
  it('passes the Redux name filter to the generated Axios request and masks ownership for guest', async () => {
    store.dispatch(actions.setSearch(' Азот '))
    await store.dispatch(actions.fetchGases())
    expect(requests[0].url).toBe('/api/gases')
    expect(requests[0].params).toEqual({ search: 'Азот' })
    expect(store.getState().gases.items[0].is_owner).toBe(0)
    expect(store.getState().gases.source).toBe('api')
    expect(store.getState().gases.pending).toBe(0)
  })
  it('falls back to filtered mock only for guests on network errors', async () => {
    handler = (config) => failure(config)
    store.dispatch(actions.setSearch('несуществующий газ'))
    await store.dispatch(actions.fetchGases())
    expect(store.getState().gases.source).toBe('mock')
    expect(store.getState().gases.items).toEqual([])
    store.dispatch(auth.signedIn({ id: 1, username: 'user' }))
    const result = await store.dispatch(actions.fetchGases())
    expect(actions.fetchGases.rejected.match(result)).toBe(true)
    expect(store.getState().gases.source).toBeNull()
    expect(store.getState().gases.pending).toBe(0)
  })
  it('does not hide HTTP 4xx errors behind mock data', async () => {
    handler = (config) => failure(config, 401)
    const result = await store.dispatch(actions.fetchGases())
    expect(actions.fetchGases.rejected.match(result)).toBe(true)
    expect(store.getState().gases.source).toBeNull()
  })
  it('retains owner permission for user and resets filters and data on logout', async () => {
    store.dispatch(auth.signedIn({ id: 1, username: 'user' }))
    store.dispatch(actions.setSearch('Азот'))
    await store.dispatch(actions.fetchGases())
    expect(store.getState().gases.items[0].is_owner).toBe(1)
    store.dispatch(auth.signedOut())
    expect(store.getState().auth.user).toBeNull()
    expect(store.getState().gases.search).toBe('')
    expect(store.getState().gases.items).toEqual([])
  })
  it('keeps the newest filter response when requests finish out of order', async () => {
    let finish!: () => void
    handler = (config) => new Promise((resolve) => { finish = () => { void response(config, [sample]).then(resolve) } })
    const old = store.dispatch(actions.fetchGases())
    handler = (config) => response(config, [])
    store.dispatch(actions.setSearch('Гелий'))
    await store.dispatch(actions.fetchGases())
    finish()
    await old
    expect(store.getState().gases.items).toEqual([])
    expect(store.getState().gases.pending).toBe(0)
  })
  it('reads current server like state before toggling and refreshes the count', async () => {
    store.dispatch(auth.signedIn({ id: 1, username: 'user' }))
    let reads = 0
    handler = (config) => response(config, config.method === 'post' ? {} : {
      ...sample, is_liked: reads++ === 0 ? 1 : 0, likes_count: reads === 1 ? 4 : 3,
    })
    const result = await store.dispatch(actions.toggleGasLike(27)).unwrap()
    expect(requests.map((r) => r.url)).toEqual(['/api/gases/feed', '/api/gases/27/like', '/api/gases/feed'])
    expect(JSON.parse(requests[1].data)).toEqual({ value: 0 })
    expect(result.count).toBe(3)
  })
  it('creates a multipart draft, publishes it, and deletes using generated methods', async () => {
    store.dispatch(auth.signedIn({ id: 1, username: 'user' }))
    handler = (config) => response(config, { ...sample, gas_status: 'draft' })
    await store.dispatch(actions.createGas({ gas_name: 'Азот', image: new File(['x'], 'x.png'), video: new File(['v'], 'v.mp4') })).unwrap()
    expect(requests[0].data).toBeInstanceOf(FormData)
    expect(store.getState().gases.draft?.id).toBe(27)
    await store.dispatch(actions.publishGas({ id: 27, data: { molar_mass: 28, density_normal_conditions: 1.25 } })).unwrap()
    expect(store.getState().gases.draft).toBeNull()
    expect(requests[1].url).toBe('/api/gases/27/publish')
    await store.dispatch(actions.deleteGas(27)).unwrap()
    expect(requests[2].method).toBe('delete')
  })
})
