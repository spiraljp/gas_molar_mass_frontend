import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchGasDetails } from '../store/gasesSlice'
import { mediaUrl } from '../api/media'

export default function GasDetailsPage({ gasId }: { gasId: number }) {
  const dispatch = useAppDispatch()
  const { details: gas, pending } = useAppSelector((state) => state.gases)
  const user = useAppSelector((state) => state.auth.user)
  useEffect(() => { void dispatch(fetchGasDetails(gasId)) }, [dispatch, gasId, user])
  return <Container as="main" className="app-screen details-screen">
    <a href="#/catalog">← Каталог</a>
    {gas?.id === gasId ? <>
      <h1 className="page-title">{gas.gas_name}</h1>
      <img className="gas-details-image" src={mediaUrl(gas.gas_image_url, '/media/default-gas.png')} alt={gas.gas_name} />
      <p>{gas.short_description}</p>
      <dl className="gas-properties">
        <dt>Формула</dt><dd>{gas.gas_formula || '—'}</dd>
        <dt>Молярная масса</dt><dd>{gas.molar_mass ?? '—'} г/моль</dd>
        <dt>Плотность при н.у.</dt><dd>{gas.density_normal_conditions ?? '—'} кг/м³</dd>
      </dl>
    </> : <p role="status">{pending ? 'Загрузка…' : 'Газ не найден'}</p>}
  </Container>
}
