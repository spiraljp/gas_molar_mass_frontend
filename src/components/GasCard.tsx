import { Button, Card } from 'react-bootstrap'
import type { Gas } from '../types/gas'

interface GasCardProps {
  gas: Gas
}

function GasCard({ gas }: GasCardProps) {
  return (
    <Card as="article" className="gas-card">
      <Card.Img
        variant="top"
        src={gas.gas_image_url?.trim() || '/media/default-gas.png'}
        alt={gas.gas_name}
        className="gas-card-image"
      />

      <Card.Body className="gas-card-body">
        <Card.Title as="h2" className="gas-card-title">
          {gas.gas_name}
        </Card.Title>

        <Card.Text className="gas-card-description">
          {gas.short_description}
        </Card.Text>

        <Card.Text className="gas-card-mass">
          {gas.molar_mass} г/моль
        </Card.Text>

        <div className="gas-card-actions">
          <Button
            as="a"
            href={`#/gas/${gas.id}`}
            variant="outline-primary"
            className="details-button"
          >
            Подробнее
          </Button>

          <div
            className="like-button"
            aria-label={`Количество лайков: ${gas.likes_count}`}
          >
            <span className="like-icon" aria-hidden="true">♡</span>
            <span className="like-count">{gas.likes_count}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default GasCard
