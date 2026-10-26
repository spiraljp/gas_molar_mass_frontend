import { Container } from 'react-bootstrap'
import GasVideo from '../components/GasVideo'
import { mockGases } from '../mocks/gases'

interface GasDetailsPageProps {
  gasId: number
}

function GasDetailsPage({ gasId }: GasDetailsPageProps) {
  const gas = mockGases.find((item) => item.id === gasId)

  if (!gas) {
    return (
      <Container as="main" className="app-screen">
        <h1 className="page-title">Газ не найден</h1>
        <a href="#/catalog">Вернуться в каталог</a>
      </Container>
    )
  }

  return (
    <Container as="main" className="app-screen">
      <a href="#/catalog" className="back-link">
        ← Каталог
      </a>

      <h1 className="page-title">{gas.gas_name}</h1>

      <img
        src={gas.gas_image_url?.trim() || '/media/default-gas.png'}
        alt={gas.gas_name}
        className="details-image"
      />

      <p className="details-description">{gas.short_description}</p>

      <dl className="gas-properties">
        <div>
          <dt>Формула</dt>
          <dd>{gas.gas_formula}</dd>
        </div>

        <div>
          <dt>Молярная масса</dt>
          <dd>{gas.molar_mass} г/моль</dd>
        </div>

        <div>
          <dt>Плотность при н.у.</dt>
          <dd>{gas.density_normal_conditions} кг/м³</dd>
        </div>

        <div>
          <dt>Лайки</dt>
          <dd>{gas.likes_count}</dd>
        </div>
      </dl>

      <h2 className="details-section-title">Видео</h2>

      <GasVideo gas={gas} className="details-video" controls />
    </Container>
  )
}

export default GasDetailsPage
