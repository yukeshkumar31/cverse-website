import { useMemo, useState } from 'react'

const INITIAL_BIKES = [
  { id: 1, make: 'Honda', model: 'Activa', registration_number: 'TN28AB1234' },
]

const INITIAL_BOOKINGS = [
  {
    id: 1,
    bike_id: 1,
    service_type: 'General service',
    status: 'booked',
    notes: 'Brake noise',
  },
]

export default function App() {
  const [bikes, setBikes] = useState(INITIAL_BIKES)
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [reg, setReg] = useState('')
  const [bikeId, setBikeId] = useState('1')
  const [serviceType, setServiceType] = useState('General service')
  const [statusFilter, setStatusFilter] = useState('')
  const [nextBikeId, setNextBikeId] = useState(2)
  const [nextBookingId, setNextBookingId] = useState(2)

  const filtered = useMemo(() => {
    if (!statusFilter) return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  function addBike(e) {
    e.preventDefault()
    setBikes([
      ...bikes,
      { id: nextBikeId, make, model, registration_number: reg.toUpperCase() },
    ])
    setNextBikeId(nextBikeId + 1)
    setMake('')
    setModel('')
    setReg('')
  }

  function addBooking(e) {
    e.preventDefault()
    const id = Number(bikeId)
    if (!bikes.some((b) => b.id === id)) {
      alert('Choose an existing bike')
      return
    }
    setBookings([
      ...bookings,
      {
        id: nextBookingId,
        bike_id: id,
        service_type: serviceType,
        status: 'booked',
        notes: '',
      },
    ])
    setNextBookingId(nextBookingId + 1)
  }

  function bikeLabel(id) {
    const bike = bikes.find((b) => b.id === id)
    return bike ? bike.registration_number : id
  }

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '1.5rem auto', padding: 16 }}>
      <h1>Fix-My-Ride (mock data)</h1>
      <p>Week 2 Day 5 — data lives only in React state.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Bikes</h2>
        <form onSubmit={addBike} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
          <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
          <input placeholder="Reg" value={reg} onChange={(e) => setReg(e.target.value)} required />
          <button type="submit">Add bike</button>
        </form>
        <ul>
          {bikes.map((b) => (
            <li key={b.id}>
              {b.registration_number} — {b.make} {b.model}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Bookings</h2>
        <label>
          Filter status{' '}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="booked">booked</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <form onSubmit={addBooking} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <select value={bikeId} onChange={(e) => setBikeId(e.target.value)}>
            {bikes.map((b) => (
              <option key={b.id} value={b.id}>
                {b.registration_number}
              </option>
            ))}
          </select>
          <input
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          />
          <button type="submit">Create booking</button>
        </form>
        <ul>
          {filtered.map((b) => (
            <li key={b.id}>
              #{b.id} · {bikeLabel(b.bike_id)} · {b.service_type} · <strong>{b.status}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
