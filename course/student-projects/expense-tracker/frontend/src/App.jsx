import { useEffect, useState } from 'react'
import { api, clearSession, getStoredUser, saveSession } from './api.js'

const NEXT_STATUS = {
  recorded: 'reviewed',
  reviewed: 'closed',
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('member@demo.com')
  const [password, setPassword] = useState('demo1234')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('member')
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
      <p className="muted">Expense Tracker BASE — C-VERSE student project</p>
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
                <option value="member">Member</option>
                <option value="admin">Admin</option>
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

function CategoriesPanel({ user }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api('/categories')
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addCategory(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/categories', {
        method: 'POST',
        body: JSON.stringify({ name, description: description || null }),
      })
      setName('')
      setDescription('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeCategory(id) {
    setError('')
    try {
      await api(`/categories/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h3>Categories</h3>
      {user.role === 'admin' && (
        <form className="row" onSubmit={addCategory} style={{ marginBottom: '1rem' }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <button type="submit">Add category</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="muted">No categories yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              {user.role === 'admin' && <th />}
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description || '—'}</td>
                {user.role === 'admin' && (
                  <td>
                    <button type="button" className="ghost" onClick={() => removeCategory(c.id)}>
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

function ExpensesPanel({ user }) {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
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
      const data = await api(`/expenses${qs ? `?${qs}` : ''}`)
      setExpenses(data)
      const cats = await api('/categories')
      setCategories(cats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  async function createExpense(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          category_id: Number(categoryId),
          title,
          amount: Number(amount),
          notes: notes || null,
        }),
      })
      setTitle('')
      setAmount('')
      setNotes('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function advanceStatus(expense) {
    const next = NEXT_STATUS[expense.status]
    if (!next) return
    setError('')
    try {
      await api(`/expenses/${expense.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeExpense(id) {
    setError('')
    try {
      await api(`/expenses/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h3>Expenses</h3>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <label>
          Filter status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="recorded">recorded</option>
            <option value="reviewed">reviewed</option>
            <option value="closed">closed</option>
          </select>
        </label>
        <label>
          Search category
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Food…" />
        </label>
        <button type="button" className="secondary" onClick={load}>
          Search
        </button>
      </div>

      {user.role === 'member' && (
        <form className="row" onSubmit={createExpense} style={{ marginBottom: '1rem' }}>
          <label>
            Category
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <button type="submit">Add expense</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="muted">No expenses found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.title}</td>
                <td>{e.category_name || e.category_id}</td>
                <td>{Number(e.amount).toFixed(2)}</td>
                <td>
                  <span className={`badge ${e.status}`}>{e.status}</span>
                </td>
                <td>{e.notes || '—'}</td>
                <td>
                  {user.role === 'admin' && NEXT_STATUS[e.status] ? (
                    <button type="button" onClick={() => advanceStatus(e)}>
                      Mark {NEXT_STATUS[e.status]}
                    </button>
                  ) : null}
                  {user.role === 'member' && e.status !== 'closed' ? (
                    <button type="button" className="ghost" onClick={() => removeExpense(e.id)}>
                      Delete
                    </button>
                  ) : null}
                  {user.role === 'admin' && !NEXT_STATUS[e.status] ? (
                    <span className="muted">Done</span>
                  ) : null}
                </td>
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
  const [tab, setTab] = useState('expenses')

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
          <h1>Expense Tracker</h1>
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
          className={tab === 'expenses' ? 'active' : 'secondary'}
          onClick={() => setTab('expenses')}
        >
          Expenses
        </button>
        <button
          type="button"
          className={tab === 'categories' ? 'active' : 'secondary'}
          onClick={() => setTab('categories')}
        >
          Categories
        </button>
      </div>

      {tab === 'categories' ? <CategoriesPanel user={user} /> : <ExpensesPanel user={user} />}
    </>
  )
}
