import { useState } from 'react'
import { Container } from 'react-bootstrap'
import GasCard from '../components/GasCard'
import GasFilter from '../components/GasFilter'
import { mockGases } from '../mocks/gases'

function CatalogPage() {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()

  const filteredGases = mockGases.filter((gas) =>
    gas.gas_name.toLowerCase().includes(query) ||
    gas.gas_formula.toLowerCase().includes(query),
  )

  return (
    <Container as="main" className="app-screen">
      <h1 className="page-title">Каталог</h1>

      <GasFilter search={search} onSearchChange={setSearch} />

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
