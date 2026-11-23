import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import GasCard from '../components/GasCard'
import GasFilter from '../components/GasFilter'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchGases, setSearch } from '../store/gasesSlice'

function CatalogPage() {
  const dispatch = useAppDispatch()
  const { search, items: filteredGases } = useAppSelector((state) => state.gases)
  const user = useAppSelector((state) => state.auth.user)
  const busy = useAppSelector((state) => state.gases.pending > 0)
  useEffect(() => {
    void dispatch(fetchGases())
  }, [user, dispatch])

  return (
    <Container as="main" className="app-screen">
      <h1 className="page-title">Каталог</h1>

      <GasFilter
        search={search}
        onSearchChange={(value) => dispatch(setSearch(value))}
        onSearch={() => { void dispatch(fetchGases()) }}
        disabled={busy}
      />

      {filteredGases.length > 0 ? (
        <section className="gas-grid" aria-label="Каталог газов">
          {filteredGases.map((gas) => (
            <GasCard key={gas.id} gas={gas} />
          ))}
        </section>
      ) : (
        <p role="status">
          Газы не найдены. Измените поисковый запрос.
        </p>
      )}
    </Container>
  )
}

export default CatalogPage
