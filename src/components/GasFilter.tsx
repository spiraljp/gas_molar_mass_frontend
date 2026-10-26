import { Form } from 'react-bootstrap'

interface GasFilterProps {
  search: string
  onSearchChange: (value: string) => void
}

function GasFilter({ search, onSearchChange }: GasFilterProps) {
  return (
    <Form.Group controlId="gas-search" className="catalog-search">
      <Form.Label visuallyHidden>
        Поиск по названию или формуле газа
      </Form.Label>

      <Form.Control
        type="search"
        placeholder="Поиск по названию или формуле"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </Form.Group>
  )
}

export default GasFilter
