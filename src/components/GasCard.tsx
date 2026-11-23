import GasActions from './GasActions'
import { mediaUrl } from '../api/media'
import { Card } from 'react-bootstrap'
import type { Gas } from '../types/gas'

interface GasCardProps {
  gas: Gas
}

function GasCard({ gas }: GasCardProps) {
  return (
    <Card as="article" className="gas-card">
      <Card.Img
        variant="top"
        src={mediaUrl(gas.gas_image_url, '/media/default-gas.png')}
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

        <a className="gas-details-link" href={`#/gas/${gas.id}`}>Подробнее</a>
        <GasActions gas={gas} />
      </Card.Body>
    </Card>
  )
}

export default GasCard
