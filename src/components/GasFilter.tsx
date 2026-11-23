import { Button, Form } from 'react-bootstrap'

interface GasFilterProps {
  search: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  disabled: boolean
}

function GasFilter({ search, onSearchChange, onSearch, disabled }: GasFilterProps) {
  return (
    <Form role="search" className="catalog-search" onSubmit={(event) => {
      event.preventDefault()
      if (!disabled) onSearch()
    }}>
      <Form.Group controlId="gas-search">
      <Form.Label visuallyHidden>
        Поиск по названию газа
      </Form.Label>

      <Form.Control
        type="search"
        placeholder="Поиск по названию"
        value={search}
        disabled={disabled}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      </Form.Group>
      <Button type="submit" disabled={disabled}>Найти</Button>
    </Form>
  )
}

export default GasFilter
