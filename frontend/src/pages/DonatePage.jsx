import { useEffect, useState } from 'react'

const emptyForm = {
  account_name: '',
  password: '',
  email: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  food_genre: '',
}

async function readApiResponse(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.')
  }

  return payload
}

function formatDate(value) {
  if (!value) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function DonatePage() {
  const [formData, setFormData] = useState(emptyForm)
  const [accounts, setAccounts] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function loadDashboard() {
    setIsLoading(true)
    setError('')

    try {
      const payload = await readApiResponse(await fetch('/api/dashboard'))
      setAccounts(payload.accounts || [])
      setPendingOrders(payload.pending_orders || [])
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = await readApiResponse(
        await fetch('/api/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }),
      )

      setSuccessMessage(payload.message || 'Account created successfully.')
      setFormData(emptyForm)
      await loadDashboard()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(account) {
    const shouldDelete = window.confirm(
      `Delete ${account.account_name}? This will also remove any related donations.`,
    )

    if (!shouldDelete) {
      return
    }

    setDeletingId(account.id)
    setError('')
    setSuccessMessage('')

    try {
      const payload = await readApiResponse(
        await fetch(`/api/accounts/${account.id}`, {
          method: 'DELETE',
        }),
      )

      setSuccessMessage(payload.message || 'Account deleted successfully.')
      await loadDashboard()
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-content">
      <section className="page-hero page-hero-compact">
        <p className="eyebrow">Database Portal</p>
        <h1>Connect MealMatch to live donor records instead of demo-only content.</h1>
        <p className="hero-text">
          This page now reads real database information from the Flask backend,
          lets you add new donor accounts, and removes records directly from the
          website.
        </p>
      </section>

      <section className="content-section card-grid card-grid-three">
        <article className="surface-card metric-card">
          <p className="eyebrow">Accounts</p>
          <h3>{accounts.length}</h3>
          <p>Live donor accounts currently stored in the database.</p>
        </article>

        <article className="surface-card metric-card">
          <p className="eyebrow">Pending Orders</p>
          <h3>{pendingOrders.length}</h3>
          <p>Donation pickup requests still waiting to be fulfilled.</p>
        </article>

        <article className="surface-card metric-card">
          <p className="eyebrow">Connection</p>
          <h3>{isLoading ? 'Syncing' : 'Live'}</h3>
          <p>
            Frontend requests are routed through Vite to the Flask database API.
          </p>
        </article>
      </section>

      {(error || successMessage) && (
        <section className="content-section">
          <div className={`status-banner ${error ? 'status-banner-error' : 'status-banner-success'}`}>
            {error || successMessage}
          </div>
        </section>
      )}

      <section className="content-section form-layout">
        <form className="surface-card form-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Add a donor account</h2>
            <p>Create a new row in the `accounts` table from the frontend.</p>
          </div>

          <div className="form-grid">
            <label>
              Account Name
              <input
                name="account_name"
                type="text"
                value={formData.account_name}
                onChange={handleChange}
                placeholder="Green Table Bistro"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="team@example.org"
                required
              />
            </label>
            <label>
              Food Genre
              <input
                name="food_genre"
                type="text"
                value={formData.food_genre}
                onChange={handleChange}
                placeholder="Prepared meals"
                required
              />
            </label>
            <label className="field-full">
              Address Line 1
              <input
                name="address_line1"
                type="text"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="123 Market Street"
                required
              />
            </label>
            <label className="field-full">
              Address Line 2
              <input
                name="address_line2"
                type="text"
                value={formData.address_line2}
                onChange={handleChange}
                placeholder="Suite, floor, or pickup notes"
              />
            </label>
            <label>
              City
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Atlanta"
                required
              />
            </label>
            <label>
              State
              <input
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="GA"
                required
              />
            </label>
            <label>
              Postal Code
              <input
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="30303"
                required
              />
            </label>
          </div>

          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving Account...' : 'Create Account'}
          </button>
        </form>

        <aside className="surface-card info-panel">
          <p className="eyebrow">Live Database View</p>
          <h2>Current donor accounts</h2>
          <p>
            These records are loaded from the backend each time the page opens
            and after every create or delete action.
          </p>

          <div className="database-list">
            {isLoading ? (
              <p>Loading database records...</p>
            ) : accounts.length === 0 ? (
              <p>No accounts are stored yet.</p>
            ) : (
              accounts.map((account) => (
                <article className="database-item" key={account.id}>
                  <div className="database-item-header">
                    <div>
                      <strong>{account.account_name}</strong>
                      <p>{account.email || 'No email provided'}</p>
                    </div>
                    <button
                      className="button button-secondary button-small"
                      type="button"
                      onClick={() => handleDelete(account)}
                      disabled={deletingId === account.id}
                    >
                      {deletingId === account.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <p>
                    {account.address_line1}
                    {account.address_line2 ? `, ${account.address_line2}` : ''}
                  </p>
                  <p>
                    {account.city}, {account.state} {account.postal_code}
                  </p>
                  <div className="database-item-meta">
                    <span>{account.food_genre}</span>
                    <span>{formatDate(account.created_at)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>

      <section className="content-section">
        <div className="surface-card">
          <div className="section-heading section-heading-tight">
            <p className="eyebrow">Pending Donations</p>
            <h2>Additional database information already available</h2>
            <p>
              This list comes from the `donations` table joined with account
              addresses, so the frontend is also displaying related data beyond
              the accounts table.
            </p>
          </div>

          <div className="database-list">
            {isLoading ? (
              <p>Loading pending orders...</p>
            ) : pendingOrders.length === 0 ? (
              <p>No pending donation pickups are in the database right now.</p>
            ) : (
              pendingOrders.map((order) => (
                <article className="database-item" key={order.donation_id}>
                  <div className="database-item-header">
                    <strong>{order.account_name}</strong>
                    <span className="status-pill">{order.status}</span>
                  </div>
                  <p>
                    {order.address_line1}
                    {order.address_line2 ? `, ${order.address_line2}` : ''}
                  </p>
                  <p>
                    {order.city}, {order.state} {order.postal_code}
                  </p>
                  <div className="database-item-meta">
                    <span>{order.notes || 'No notes attached'}</span>
                    <span>{formatDate(order.donated_at)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DonatePage
