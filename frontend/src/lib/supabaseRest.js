import bcrypt from 'bcryptjs'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function getConfigError() {
  if (supabaseUrl && supabaseAnonKey) {
    return ''
  }

  return 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.local to connect the website directly to Supabase.'
}

function buildHeaders(extraHeaders = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    ...extraHeaders,
  }
}

async function parseSupabaseResponse(response) {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.message || payload?.error_description || payload?.hint || payload?.error || 'Request failed.'
    throw new Error(message)
  }

  return payload
}

function ensureConfigured() {
  const configError = getConfigError()

  if (configError) {
    throw new Error(configError)
  }
}

export function readConnectionMessage() {
  return getConfigError()
}

export async function fetchAccounts() {
  ensureConfigured()

  const params = new URLSearchParams({
    select:
      'id,account_name,email,address_line1,address_line2,city,state,postal_code,food_genre,created_at',
    order: 'created_at.desc',
  })

  const response = await fetch(`${supabaseUrl}/rest/v1/accounts?${params.toString()}`, {
    headers: buildHeaders(),
  })

  return parseSupabaseResponse(response)
}

export async function fetchPendingOrders() {
  ensureConfigured()

  const params = new URLSearchParams({
    select:
      'id,donated_at,notes,status,accounts!inner(account_name,address_line1,address_line2,city,state,postal_code)',
    status: 'eq.pending',
    order: 'donated_at.asc',
  })

  const response = await fetch(`${supabaseUrl}/rest/v1/donations?${params.toString()}`, {
    headers: buildHeaders(),
  })

  const rows = await parseSupabaseResponse(response)

  return rows.map((row) => ({
    donation_id: row.id,
    donated_at: row.donated_at,
    notes: row.notes,
    status: row.status,
    account_name: row.accounts?.account_name,
    address_line1: row.accounts?.address_line1,
    address_line2: row.accounts?.address_line2,
    city: row.accounts?.city,
    state: row.accounts?.state,
    postal_code: row.accounts?.postal_code,
  }))
}

export async function completeDonations(donationIds) {
  ensureConfigured()

  if (!Array.isArray(donationIds) || donationIds.length === 0) {
    return []
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/donations?id=in.(${donationIds.join(',')})`,
    {
      method: 'PATCH',
      headers: buildHeaders({
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      }),
      body: JSON.stringify({
        status: 'completed',
      }),
    },
  )

  return parseSupabaseResponse(response)
}

export async function createDonation(donation) {
  ensureConfigured()

  const donationPayload = [
    {
      account_id: Number(donation.accountId),
      notes: donation.notes?.trim() || null,
      status: 'pending',
    },
  ]

  const donationParams = new URLSearchParams({
    select: 'id,account_id,donated_at,notes,status',
  })

  const donationResponse = await fetch(`${supabaseUrl}/rest/v1/donations?${donationParams.toString()}`, {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify(donationPayload),
  })

  const donationRows = await parseSupabaseResponse(donationResponse)
  const createdDonation = donationRows[0]

  if (donation.foodName?.trim()) {
    const itemPayload = [
      {
        donation_id: createdDonation.id,
        food_name: donation.foodName.trim(),
        quantity: donation.quantity?.trim() ? Number(donation.quantity) : null,
        unit: donation.unit?.trim() || null,
        category: donation.category?.trim() || null,
      },
    ]

    const itemResponse = await fetch(`${supabaseUrl}/rest/v1/donation_items`, {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      }),
      body: JSON.stringify(itemPayload),
    })

    await parseSupabaseResponse(itemResponse)
  }

  return createdDonation
}

export async function createAccount(account) {
  ensureConfigured()

  const password_hash = await bcrypt.hash(account.password, 10)

  const payload = [
    {
      account_name: account.account_name.trim(),
      password_hash,
      email: account.email.trim().toLowerCase(),
      address_line1: account.address_line1.trim(),
      address_line2: account.address_line2.trim() || null,
      city: account.city.trim(),
      state: account.state.trim(),
      postal_code: account.postal_code.trim(),
      food_genre: account.food_genre.trim(),
    },
  ]

  const params = new URLSearchParams({
    select:
      'id,account_name,email,address_line1,address_line2,city,state,postal_code,food_genre,created_at',
  })

  const response = await fetch(`${supabaseUrl}/rest/v1/accounts?${params.toString()}`, {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify(payload),
  })

  const rows = await parseSupabaseResponse(response)
  return rows[0]
}

export async function deleteAccount(accountId) {
  ensureConfigured()

  const response = await fetch(`${supabaseUrl}/rest/v1/accounts?id=eq.${accountId}`, {
    method: 'DELETE',
    headers: buildHeaders({
      Prefer: 'return=representation',
    }),
  })

  const rows = await parseSupabaseResponse(response)

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Account not found.')
  }
}
