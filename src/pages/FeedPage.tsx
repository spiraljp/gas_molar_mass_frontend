import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import GasVideo from '../components/GasVideo'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchGasFeed, toggleGasLike } from '../store/gasesSlice'

function FeedPage() {
  const dispatch = useAppDispatch()
  const { feed: gas, pending } = useAppSelector((state) => state.gases)
  const user = useAppSelector((state) => state.auth.user)
  useEffect(() => { void dispatch(fetchGasFeed({})) }, [dispatch, user])

  if (!gas) {
    return (
      <main className="app-screen">
        <h1 className="page-title">Лента</h1>
        <p>Газы пока отсутствуют.</p>
      </main>
    )
  }

  function showNextGas() {
    void dispatch(fetchGasFeed({ id: gas!.id, next: true }))
  }

  return (
    <main className="feed-screen" aria-label="Лента газов">
      <GasVideo gas={gas} className="feed-video" />

      <div className="feed-shadow" />

      <button
        type="button"
        disabled={!user || pending > 0}
        onClick={() => { void dispatch(toggleGasLike(gas.id)) }}
        className="feed-like"
        aria-label={`Количество лайков: ${gas.likes_count}`}
      >
        <span className="feed-heart" aria-hidden="true">{gas.is_liked ? '♥' : '♡'}</span>
        <span className="feed-like-count">{gas.likes_count}</span>
      </button>

      <section className="feed-info" aria-live="polite">
        <h1>
          {gas.gas_name} {gas.gas_formula}
        </h1>

        <p>
          Молярная масса: {gas.molar_mass} г/моль
          <br />
          Плотность при н.у.: {gas.density_normal_conditions} кг/м³
        </p>

        <a href={`#/gas/${gas.id}`}>Подробнее</a>
      </section>

      <Button
        type="button"
        className="next-icon-button"
        onClick={showNextGas}
        disabled={pending > 0}
        aria-label="Следующий газ"
        title="Следующий газ"
      >
        <span aria-hidden="true">›</span>
      </Button>
    </main>
  )
}

export default FeedPage
