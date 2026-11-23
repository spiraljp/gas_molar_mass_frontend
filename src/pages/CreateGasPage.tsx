import { useEffect, useState, type FormEvent } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../store'
import { createGas, deleteGas, fetchGasDraft, publishGas } from '../store/gasesSlice'
import { mediaUrl } from '../api/media'
import FilePreview from '../components/FilePreview'

export default function CreateGasPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { draft, pending } = useAppSelector((state) => state.gases)
  const [name, setName] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [mass, setMass] = useState('')
  const [density, setDensity] = useState('')
  useEffect(() => { if (user) void dispatch(fetchGasDraft()) }, [dispatch, user])
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (image && video) await dispatch(createGas({ gas_name: name.trim(), image, video }))
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    try {
      await dispatch(publishGas({ id: draft.id, data: {
        molar_mass: Number(mass), density_normal_conditions: Number(density),
      } })).unwrap()
      window.location.hash = '/catalog'
    } catch { /* Error is displayed by the shared Redux notification. */ }
  }
  return <Container as="main" className="app-screen">
    <h1 className="page-title">Добавление газа</h1>
    {!user ? <p>Для добавления газа <a href="#/login">войдите</a>.</p> : draft ? <>
      <h2>{draft.gas_name}</h2>
      <p>Черновик №{draft.id}</p>
      <img className="draft-image" src={mediaUrl(draft.gas_image_url, '/media/default-gas.png')} alt={draft.gas_name} />
      <Form className="create-form" onSubmit={publish}>
        <Form.Group controlId="gas-mass"><Form.Label>Молярная масса, г/моль</Form.Label>
          <Form.Control type="number" min="0.000001" step="any" required value={mass} onChange={(event) => setMass(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="gas-density"><Form.Label>Плотность при н.у., кг/м³</Form.Label>
          <Form.Control type="number" min="0.000001" step="any" required value={density} onChange={(event) => setDensity(event.target.value)} />
        </Form.Group>
        <Button type="submit" disabled={pending > 0}>Опубликовать</Button>
        <Button variant="outline-danger" disabled={pending > 0} onClick={() => { void dispatch(deleteGas(draft.id)) }}>Удалить черновик</Button>
      </Form>
    </> : <Form className="create-form" onSubmit={create}>
      <Form.Group controlId="gas-name"><Form.Label>Название газа</Form.Label>
        <Form.Control required pattern=".*\S.*" value={name} onChange={(event) => setName(event.target.value)} />
      </Form.Group>
      <Form.Group controlId="gas-image"><Form.Label>Изображение</Form.Label>
        {image && <FilePreview file={image} kind="image" />}
        <Form.Control type="file" accept="image/*" required onChange={(event) => setImage((event.target as HTMLInputElement).files?.[0] || null)} />
      </Form.Group>
      <Form.Group controlId="gas-video"><Form.Label>Видео</Form.Label>
        {video && <FilePreview file={video} kind="video" />}
        <Form.Control type="file" accept="video/*" required onChange={(event) => setVideo((event.target as HTMLInputElement).files?.[0] || null)} />
      </Form.Group>
      <Button type="submit" disabled={pending > 0}>Создать черновик</Button>
    </Form>}
  </Container>
}
