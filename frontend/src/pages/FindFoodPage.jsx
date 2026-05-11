import { useEffect, useState } from 'react'
import MapShowcase from '../components/MapShowcase'
import {
  fetchAccounts,
  fetchPendingOrders,
  readConnectionMessage,
} from '../lib/supabaseRest'

const emptyFilters = {
  location: '',
  foodType: '',
  status: 'all',
}

function buildRestaurantResults(accounts, pendingOrders) {
  const pendingCounts = pendingOrders.reduce((totals, order) => {
    const key = order.account_name || ''
    totals[key] = (totals[key] || 0) + 1
    return totals
  }, {})

  return accounts.map((account) => ({
    ...account,
    pendingCount: pendingCounts[account.account_name] || 0,
  }))
}

function matchesLocation(account, location) {
  if (!location) {
    return true
  }

  const haystack = [
    account.account_name,
    account.city,
    account.state,
    account.postal_code,
    account.address_line1,
    account.address_line2,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(location.toLowerCase())
}

function matchesFoodType(account, foodType) {
  if (!foodType) {
    return true
  }

  return (account.food_genre || '').toLowerCase() === foodType.toLowerCase()
}

function matchesStatus(account, status) {
  if (status === 'all') {
    return true
  }

  if (status === 'pending') {
    return account.pendingCount > 0
  }

  if (status === 'standby') {
    return account.pendingCount === 0
  }

  return true
}

function FindFoodPage() {
  const [filters, setFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const [restaurants, setRestaurants] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [connectionMessage] = useState(readConnectionMessage())

  useEffect(() => {
    async function loadDatabaseResults() {
      setIsLoading(true)
      setError('')

      try {
        const [accountsResult, pendingOrdersResult] = await Promise.all([
          fetchAccounts(),
          fetchPendingOrders(),
        ])
        setRestaurants(accountsResult || [])
        setPendingOrders(pendingOrdersResult || [])
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDatabaseResults()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  const restaurantResults = buildRestaurantResults(restaurants, pendingOrders)
  const filteredRestaurants = restaurantResults.filter(
    (account) =>
      matchesLocation(account, appliedFilters.location) &&
      matchesFoodType(account, appliedFilters.foodType) &&
      matchesStatus(account, appliedFilters.status),
  )

  const foodTypes = [...new Set(restaurants.map((account) => account.food_genre).filter(Boolean))].sort()

  return (
    <div className="page-content">
      <section className="page-hero page-hero-compact">
        <p className="eyebrow">Find Food</p>
        <h1>Search live restaurant and donor records from the database.</h1>
        <p className="hero-text">
          The search experience now uses the real partner records stored in
          Supabase, making it easy to browse food donors by area, food type, and
          pickup readiness.
        </p>
      </section>

      {(error || connectionMessage) && (
        <section className="content-section">
          <div className="status-banner status-banner-error">
            {error || connectionMessage}
          </div>
        </section>
      )}

      <section className="content-section">
        <form className="surface-card filter-bar" onSubmit={handleSearch}>
          <label>
            Location
            <input
              name="location"
              type="text"
              value={filters.location}
              onChange={handleChange}
              placeholder="City, ZIP code, or street"
            />
          </label>
          <label>
            Food Type
            <select name="foodType" value={filters.foodType} onChange={handleChange}>
              <option value="">All food types</option>
              {foodTypes.map((foodType) => (
                <option key={foodType} value={foodType}>
                  {foodType}
                </option>
              ))}
            </select>
          </label>
          <label>
            Queue Status
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="all">All partners</option>
              <option value="pending">Active pickup queue</option>
              <option value="standby">Standby only</option>
            </select>
          </label>
          <button className="button button-primary" type="submit">
            Search Database
          </button>
        </form>
      </section>

      <MapShowcase
        compact
        title="Live partner search now connected to the operational dataset"
        description="The map area still acts as a visual placeholder, but the search and results below now come from the real restaurant and donor records stored in the MealMatch database."
      />

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Live Results</p>
          <h2>Restaurants and donor partners currently in the database</h2>
          <p>
            Search results update from the stored account records, with queue
            status layered in from the live pending donation data.
          </p>
        </div>

        <div className="card-grid card-grid-three">
          {isLoading ? (
            <article className="surface-card listing-card">
              <h3>Loading partner records...</h3>
              <p>Pulling the latest restaurant data from Supabase.</p>
            </article>
          ) : filteredRestaurants.length === 0 ? (
            <article className="surface-card listing-card">
              <h3>No matching partners found</h3>
              <p>Try widening the location or food type filters to see more results.</p>
            </article>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <article className="surface-card listing-card" key={restaurant.id}>
                <div className="listing-meta">
                  <span className="listing-type">{restaurant.food_genre || 'Donor partner'}</span>
                  <span>
                    {restaurant.city}, {restaurant.state}
                  </span>
                </div>
                <h3>{restaurant.account_name}</h3>
                <p>
                  {restaurant.address_line1}
                  {restaurant.address_line2 ? `, ${restaurant.address_line2}` : ''}
                </p>
                <p>
                  {restaurant.email || 'No public contact email listed'}
                </p>
                <div className="listing-footer">
                  <strong>
                    {restaurant.pendingCount > 0
                      ? `${restaurant.pendingCount} active pickup request${restaurant.pendingCount > 1 ? 's' : ''}`
                      : 'Standby partner'}
                  </strong>
                  <span className="status-pill">
                    {restaurant.pendingCount > 0 ? 'Queue Active' : 'Available'}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default FindFoodPage
