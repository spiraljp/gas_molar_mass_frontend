import { Button } from 'react-bootstrap'
import type { Gas } from '../types/gas'
import { useAppDispatch, useAppSelector } from '../store'
import { deleteGas, toggleGasLike } from '../store/gasesSlice'
export default function GasActions({ gas }: { gas: Gas }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const busy = useAppSelector((state) => state.gases.pending > 0)
  return <div className="service-actions">
    <Button variant="outline-primary" disabled={!user || busy}
      aria-label={`Лайк: ${gas.gas_name}`} aria-pressed={!!gas.is_liked}
      onClick={() => { void dispatch(toggleGasLike(gas.id)) }}>
      {gas.is_liked ? '♥' : '♡'} {gas.likes_count}
    </Button>
    {!!user && gas.is_owner === 1 && <Button variant="outline-danger" disabled={busy}
      onClick={() => { void dispatch(deleteGas(gas.id)) }}>Удалить</Button>}
  </div>
}
