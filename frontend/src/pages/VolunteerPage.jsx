import { useEffect, useMemo, useState } from 'react'
import {
  completeDonations,
  fetchPendingOrders,
  readConnectionMessage,
} from '../lib/supabaseRest'

function formatDate(value) {
  if (!value) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function sortRecommendedRoute(orders) {
  return [...orders].sort(
    (left, right) => new Date(left.donated_at).getTime() - new Date(right.donated_at).getTime(),
  )
}

function matchesCity(order, city) {
  if (!city.trim()) {
    return false
  }

  return (order.city || '').toLowerCase() === city.trim().toLowerCase()
}

function VolunteerPage() {
  const [city, setCity] = useState('')
  const [appliedCity, setAppliedCity] = useState('')
  const [pendingOrders, setPendingOrders] = useState([])
  const [claimedOrders, setClaimedOrders] = useState([])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [connectionMessage] = useState(readConnectionMessage())

  useEffect(() => {
    async function loadPendingOrders() {
      setIsLoading(true)
      setError('')

      try {
        const results = await fetchPendingOrders()
        setPendingOrders(results || [])
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPendingOrders()
  }, [])

  const cityOrders = useMemo(
    () => pendingOrders.filter((order) => matchesCity(order, appliedCity)),
    [appliedCity, pendingOrders],
  )

  const recommendedRoute = useMemo(() => sortRecommendedRoute(cityOrders), [cityOrders])

  function handleSearch(event) {
    event.preventDefault()
    setAppliedCity(city)
    setSuccessMessage('')
    setClaimedOrders([])
  }

  async function handleClaimAll() {
    if (recommendedRoute.length === 0) {
      setError('No pending orders were found for that city.')
      return
    }

    setIsClaiming(true)
    setError('')
    setSuccessMessage('')

    try {
      const donationIds = recommendedRoute.map((order) => order.donation_id)
      await completeDonations(donationIds)
      setClaimedOrders(recommendedRoute)
      setPendingOrders((current) =>
        current.filter((order) => !donationIds.includes(order.donation_id)),
      )
      setSuccessMessage(
        `Claimed ${recommendedRoute.length} order${recommendedRoute.length > 1 ? 's' : ''} in ${appliedCity}. They are no longer pending.`,
      )
    } catch (claimError) {
      setError(claimError.message)
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="page-content">
      <section className="page-hero page-hero-compact">
        <p className="eyebrow">Volunteer Dispatch</p>
        <h1>Claim a city’s open pickups and get a recommended route instantly.</h1>
        <p className="hero-text">
          Volunteers can search a city queue, review every pending order in that
          area, and claim the full batch so those records are no longer marked
          pending in the live database.
        </p>
      </section>

      {(error || successMessage || connectionMessage) && (
        <section className="content-section">
          <div
            className={`status-banner ${
              error || connectionMessage ? 'status-banner-error' : 'status-banner-success'
            }`}
          >
            {error || connectionMessage || successMessage}
          </div>
        </section>
      )}

      <section className="content-section">
        <form className="surface-card volunteer-search-bar" onSubmit={handleSearch}>
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter a city like Atlanta"
            />
          </label>
          <button className="button button-primary" type="submit">
            Search City Queue
          </button>
        </form>
      </section>

      <section className="content-section volunteer-layout">
        <div className="surface-card volunteer-queue-panel">
          <div className="section-heading section-heading-tight volunteer-panel-header">
            <div>
              <p className="eyebrow">Pending In City</p>
              <h2>{appliedCity ? `${appliedCity} pickup queue` : 'Search a city to load a queue'}</h2>
              <p>
                Claiming this batch marks the city’s current pending donation
                orders as completed so they disappear from the active queue.
              </p>
            </div>
            <div className="queue-summary">
              <span className="queue-summary-label">Open stops</span>
              <strong>{recommendedRoute.length}</strong>
            </div>
          </div>

          <div className="database-list pending-donations-list">
            {isLoading ? (
              <div className="pending-empty-state">
                <strong>Loading pending orders...</strong>
                <p>Pulling the latest city queues from Supabase.</p>
              </div>
            ) : appliedCity && recommendedRoute.length > 0 ? (
              recommendedRoute.map((order, index) => (
                <article className="database-item pending-donation-card" key={order.donation_id}>
                  <div className="database-item-header pending-donation-topline">
                    <div>
                      <p className="pending-donation-label">Stop {index + 1}</p>
                      <strong>{order.account_name}</strong>
                    </div>
                    <span className="status-pill">Pending</span>
                  </div>

                  <div className="pending-donation-grid">
                    <div className="pending-donation-block">
                      <span className="pending-donation-label">Pickup address</span>
                      <p>
                        {order.address_line1}
                        {order.address_line2 ? `, ${order.address_line2}` : ''}
                      </p>
                      <p>
                        {order.city}, {order.state} {order.postal_code}
                      </p>
                    </div>

                    <div className="pending-donation-block">
                      <span className="pending-donation-label">Pickup notes</span>
                      <p>{order.notes || 'No special handling notes were provided.'}</p>
                    </div>
                  </div>

                  <div className="database-item-meta pending-donation-meta">
                    <span>Donation ID #{order.donation_id}</span>
                    <span>Submitted {formatDate(order.donated_at)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="pending-empty-state">
                <strong>No queue loaded yet.</strong>
                <p>
                  Enter a city and search to find all currently pending donation
                  pickups in that area.
                </p>
              </div>
            )}
          </div>

          <button
            className="button button-primary volunteer-claim-button"
            type="button"
            onClick={handleClaimAll}
            disabled={isClaiming || !!connectionMessage || recommendedRoute.length === 0}
          >
            {isClaiming ? 'Claiming Orders...' : 'Claim All Orders In This City'}
          </button>
        </div>

        <aside className="surface-card volunteer-route-panel">
          <p className="eyebrow">Recommended Order</p>
          <h2>Suggested pickup sequence</h2>
          <p>
            MealMatch currently recommends an oldest-first route so volunteers
            address the longest-waiting donation requests first.
          </p>

          <div className="volunteer-route-list">
            {recommendedRoute.length === 0 ? (
              <div className="pending-empty-state">
                <strong>No recommendations yet.</strong>
                <p>Search a city queue to generate a suggested pickup order.</p>
              </div>
            ) : (
              recommendedRoute.map((order, index) => (
                <article className="volunteer-route-stop" key={order.donation_id}>
                  <span className="volunteer-route-number">{index + 1}</span>
                  <div>
                    <strong>{order.account_name}</strong>
                    <p>
                      {order.address_line1}, {order.city}, {order.state}
                    </p>
                    <p>Submitted {formatDate(order.donated_at)}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          {claimedOrders.length > 0 && (
            <div className="info-highlight">
              <strong>Claimed batch recorded</strong>
              <p>
                {claimedOrders.length} order{claimedOrders.length > 1 ? 's were' : ' was'} claimed for{' '}
                {appliedCity} and removed from the pending queue.
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default VolunteerPage
