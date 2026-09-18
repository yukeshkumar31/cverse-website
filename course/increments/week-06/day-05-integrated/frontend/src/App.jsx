import { useEffect, useState } from 'react'
import { api, clearSession, getStoredUser, saveSession } from './api.js'

const NEXT_STATUS = {
  booked: 'in_progress',
  in_progress: 'completed',
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('customer@demo.com')
  const [password, setPassword] = useState('demo1234')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role,
          }),
        })
      }
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      saveSession(data.access_token, data.user)
      onAuth(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card auth-box">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <p className="muted">Fix-My-Ride BASE — C-VERSE reference app</p>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <label>
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
              </select>
            </label>
          </>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row" style={{ marginTop: '0.75rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>
      </form>
    </div>
  )
}

function BikesPanel({ user }) {
  const [bikes, setBikes] = useState([])
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [reg, setReg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api('/bikes')
      setBikes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addBike(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/bikes', {
        method: 'POST',
        body: JSON.stringify({
          make,
          model,
          registration_number: reg,
        }),
      })
      setMake('')
      setModel('')
      setReg('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeBike(id) {
    setError('')
    try {
      await api(`/bikes/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h3>Bikes</h3>
      {user.role === 'customer' && (
        <form className="row" onSubmit={addBike} style={{ marginBottom: '1rem' }}>
          <label>
            Make
            <input value={make} onChange={(e) => setMake(e.target.value)} required />
          </label>
          <label>
            Model
            <input value={model} onChange={(e) => setModel(e.target.value)} required />
          </label>
          <label>
            Registration
            <input value={reg} onChange={(e) => setReg(e.target.value)} required />
          </label>
          <button type="submit">Add bike</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : bikes.length === 0 ? (
        <p className="muted">No bikes yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Reg</th>
              <th>Make</th>
              <th>Model</th>
              {user.role === 'customer' && <th />}
            </tr>
          </thead>
          <tbody>
            {bikes.map((b) => (
              <tr key={b.id}>
                <td>{b.registration_number}</td>
                <td>{b.make}</td>
                <td>{b.model}</td>
                {user.role === 'customer' && (
                  <td>
                    <button type="button" className="ghost" onClick={() => removeBike(b.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function BookingsPanel({ user }) {
  const [bookings, setBookings] = useState([])
  const [bikes, setBikes] = useState([])
  const [bikeId, setBikeId] = useState('')
  const [serviceType, setServiceType] = useState('General service')
  const [notes, setNotes] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (q) params.set('q', q)
      const qs = params.toString()
      const data = await api(`/bookings${qs ? `?${qs}` : ''}`)
      setBookings(data)
      if (user.role === 'customer') {
        const bikeData = await api('/bikes')
        setBikes(bikeData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  async function createBooking(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bike_id: Number(bikeId),
          service_type: serviceType,
          notes: notes || null,
        }),
      })
      setNotes('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function advanceStatus(booking) {
    const next = NEXT_STATUS[booking.status]
    if (!next) return
    setError('')
    try {
      await api(`/bookings/${booking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h3>Bookings</h3>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <label>
          Filter status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="booked">booked</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <label>
          Search registration
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="TN28…" />
        </label>
        <button type="button" className="secondary" onClick={load}>
          Search
        </button>
      </div>

      {user.role === 'customer' && (
        <form className="row" onSubmit={createBooking} style={{ marginBottom: '1rem' }}>
          <label>
            Bike
            <select value={bikeId} onChange={(e) => setBikeId(e.target.value)} required>
              <option value="">Select…</option>
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.registration_number} — {b.make} {b.model}
                </option>
              ))}
            </select>
          </label>
          <label>
            Service type
            <input value={serviceType} onChange={(e) => setServiceType(e.target.value)} required />
          </label>
          <label>
            Notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <button type="submit">Book service</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="muted">No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bike</th>
              <th>Service</th>
              <th>Status</th>
              <th>Notes</th>
              {user.role === 'staff' && <th />}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.bike_registration || b.bike_id}</td>
                <td>{b.service_type}</td>
                <td>
                  <span className={`badge ${b.status}`}>{b.status}</span>
                </td>
                <td>{b.notes || '—'}</td>
                {user.role === 'staff' && (
                  <td>
                    {NEXT_STATUS[b.status] ? (
                      <button type="button" onClick={() => advanceStatus(b)}>
                        Mark {NEXT_STATUS[b.status]}
                      </button>
                    ) : (
                      <span className="muted">Done</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(getStoredUser())
  const [tab, setTab] = useState('bookings')

  function logout() {
    clearSession()
    setUser(null)
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Fix-My-Ride</h1>
          <p>
            {user.full_name} · <strong>{user.role}</strong>
          </p>
        </div>
        <button type="button" className="ghost" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="tabs">
        <button
          type="button"
          className={tab === 'bookings' ? 'active' : 'secondary'}
          onClick={() => setTab('bookings')}
        >
          Bookings
        </button>
        <button
          type="button"
          className={tab === 'bikes' ? 'active' : 'secondary'}
          onClick={() => setTab('bikes')}
        >
          Bikes
        </button>
      </div>

      {tab === 'bikes' ? <BikesPanel user={user} /> : <BookingsPanel user={user} />}
    </>
  )
}
