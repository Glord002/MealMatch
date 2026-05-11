import { useEffect, useMemo, useState } from 'react'
import {
  createDonation,
  fetchAccounts,
  readConnectionMessage,
} from '../lib/supabaseRest'

const emptyForm = {
  accountId: '',
  signInName: '',
  signInPassword: '',
  foodName: '',
  quantity: '',
  unit: '',
  category: '',
  notes: '',
}

function DonateNowPage() {
  const [accounts, setAccounts] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [connectionMessage] = useState(readConnectionMessage())

  useEffect(() => {
    async function loadAccounts() {
      setIsLoading(true)
      setError('')

      try {
        const results = await fetchAccounts()
        setAccounts(results || [])
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [])

  const selectedAccount = useMemo(
    () => accounts.find((account) => String(account.id) === formData.accountId),
    [accounts, formData.accountId],
  )

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await createDonation(formData)
      setSuccessMessage(
        `Donation created for ${selectedAccount?.account_name || 'the selected donor'}. It is now in the pending pickup queue.`,
      )
      setFormData(emptyForm)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-content">
      <section className="page-hero page-hero-compact">
        <p className="eyebrow">Donate Now</p>
        <h1>Submit a live donation as any donor account already in the database.</h1>
        <p className="hero-text">
          This workflow lets a donor choose an existing account, optionally fill
          in sign-in details for the future, and send a real donation into the
          operational pickup queue.
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

      <section className="content-section form-layout">
        <form className="surface-card form-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Create a donation</h2>
            <p>
              Sign-in is optional for now. You can simply select the donor
              account you want to donate as and submit the pickup request.
            </p>
          </div>

          <div className="form-grid">
            <label className="field-full">
              Donor Account
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select a donor account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name} - {account.city}, {account.state}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Optional Sign-In Name
              <input
                name="signInName"
                type="text"
                value={formData.signInName}
                onChange={handleChange}
                placeholder="Optional for future login flow"
              />
            </label>
            <label>
              Optional Password
              <input
                name="signInPassword"
                type="password"
                value={formData.signInPassword}
                onChange={handleChange}
                placeholder="Not required right now"
              />
            </label>

            <label>
              Food Name
              <input
                name="foodName"
                type="text"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="Prepared meals, produce, pastries"
                required
              />
            </label>
            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="40"
              />
            </label>
            <label>
              Unit
              <input
                name="unit"
                type="text"
                value={formData.unit}
                onChange={handleChange}
                placeholder="boxes, trays, bags"
              />
            </label>
            <label>
              Category
              <input
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="Prepared meals"
              />
            </label>
            <label className="field-full">
              Donation Notes
              <textarea
                name="notes"
                rows="5"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Pickup window, refrigeration details, packaging notes, or access instructions"
              />
            </label>
          </div>

          <button
            className="button button-primary"
            type="submit"
            disabled={isSubmitting || !!connectionMessage || isLoading}
          >
            {isSubmitting ? 'Submitting Donation...' : 'Submit Donation'}
          </button>
        </form>

        <aside className="surface-card info-panel">
          <p className="eyebrow">Selected Donor</p>
          <h2>{selectedAccount ? selectedAccount.account_name : 'Choose an account to preview'}</h2>
          <p>
            {selectedAccount
              ? 'This donation will be attached to the donor account shown below.'
              : 'Once you select a donor account, its location and contact details will appear here.'}
          </p>

          {selectedAccount ? (
            <div className="database-list">
              <article className="database-item">
                <div className="database-item-header">
                  <strong>{selectedAccount.account_name}</strong>
                  <span className="status-pill">{selectedAccount.food_genre}</span>
                </div>
                <p>{selectedAccount.email || 'No email listed'}</p>
                <p>
                  {selectedAccount.address_line1}
                  {selectedAccount.address_line2 ? `, ${selectedAccount.address_line2}` : ''}
                </p>
                <p>
                  {selectedAccount.city}, {selectedAccount.state} {selectedAccount.postal_code}
                </p>
              </article>
            </div>
          ) : (
            <div className="pending-empty-state">
              <strong>No donor selected yet.</strong>
              <p>Pick a donor account from the form to review where this donation will originate.</p>
            </div>
          )}

          <div className="info-highlight">
            <strong>Current demo behavior</strong>
            <p>
              The sign-in fields are intentionally optional right now. The live
              donation is created from the selected donor account even if no
              login details are entered.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default DonateNowPage
