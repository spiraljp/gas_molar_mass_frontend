import { useState } from 'react'
import { Button } from 'react-bootstrap'
import GasVideo from '../components/GasVideo'
import { mockGases } from '../mocks/gases'

function FeedPage() {
  const [index, setIndex] = useState(0)

  if (mockGases.length === 0) {
    return (
      <main className="app-screen">
        <h1 className="page-title">Лента</h1>
        <p>Газы пока отсутствуют.</p>
      </main>
    )
  }

  const gas = mockGases[index]

  function showNextGas() {
    setIndex((currentIndex) => (currentIndex + 1) % mockGases.length)
  }

  return (
    <main className="feed-screen" aria-label="Лента газов">
      <GasVideo gas={gas} className="feed-video" />

      <div className="feed-shadow" />

      <div
        className="feed-like"
        aria-label={`Количество лайков: ${gas.likes_count}`}
      >
        <span className="feed-heart" aria-hidden="true">♡</span>
        <span className="feed-like-count">{gas.likes_count}</span>
      </div>

      <section className="feed-info" aria-live="polite">
        <h1>
          {gas.gas_name} {gas.gas_formula}
        </h1>

        <p>
          Молярная масса: {gas.molar_mass} г/моль
          <br />
          Плотность при н.у.: {gas.density_normal_conditions} кг/м³
        </p>

        <a href={`#/gas/${gas.id}`} className="feed-details-link">
          Подробнее
        </a>
      </section>

      <Button
        type="button"
        className="next-icon-button"
        onClick={showNextGas}
        aria-label="Следующий газ"
        title="Следующий газ"
      >
        <span aria-hidden="true">›</span>
      </Button>
    </main>
  )
}

export default FeedPage
