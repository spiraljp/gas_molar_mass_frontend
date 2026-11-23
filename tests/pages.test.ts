import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'

vi.stubEnv('VITE_MOCK_ONLY', 'true')
const network = vi.fn(() => { throw new Error('Pages must never call the backend') })
axios.defaults.adapter = network
const { store } = await import('../src/store')
const actions = await import('../src/store/gasesSlice')
const auth = await import('../src/store/authSlice')
const authApi = await import('../src/api/auth')
const { mediaUrl } = await import('../src/api/media')

beforeEach(() => {
  store.dispatch(auth.signedOut())
  network.mockClear()
})
describe('GitHub Pages mock-only mode', () => {
  it('filters mock data, opens details and preserves the Redux filter without network', async () => {
    store.dispatch(actions.setSearch('Азот'))
    await store.dispatch(actions.fetchGases()).unwrap()
    const gases = store.getState().gases.items
    expect(gases).toHaveLength(1)
    await store.dispatch(actions.fetchGasDetails(gases[0].id)).unwrap()
    expect(store.getState().gases.details?.gas_name).toBe('Азот')
    expect(store.getState().gases.search).toBe('Азот')
    expect(store.getState().gases.items).toEqual(gases)
    await store.dispatch(actions.fetchGasFeed({})).unwrap()
    expect(store.getState().gases.source).toBe('mock')
    expect(network).not.toHaveBeenCalled()
  })
  it('blocks auth and mutations even when called directly', async () => {
    await expect(authApi.login('user', 'password')).rejects.toThrow('mock')
    await expect(authApi.logout()).rejects.toThrow('mock')
    store.dispatch(auth.signedIn({ id: 1, username: 'user' }))
    const result = await store.dispatch(actions.deleteGas(2))
    expect(actions.deleteGas.rejected.match(result)).toBe(true)
    expect(network).not.toHaveBeenCalled()
  })
  it('keeps local images under the Pages repository base path', () => {
    vi.stubEnv('BASE_URL', '/gas_molar_mass_frontend/')
    expect(mediaUrl('/media/nitrogen-n2.png', '/media/default-gas.png'))
      .toBe('/gas_molar_mass_frontend/media/nitrogen-n2.png')
    expect(mediaUrl(null, '/media/default-gas.png'))
      .toBe('/gas_molar_mass_frontend/media/default-gas.png')
  })
})
