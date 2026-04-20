const axios = require('axios')

const RELOADLY_CLIENT_ID = process.env.RELOADLY_CLIENT_ID!
const RELOADLY_CLIENT_SECRET = process.env.RELOADLY_CLIENT_SECRET!
const BASE_URL = 'https://topups.reloadly.com'
const AUTH_URL = 'https://auth.reloadly.com'

// Get access token (Reloadly uses OAuth2)
const getAccessToken = async (): Promise<string> => {
  const response = await axios.post(`${AUTH_URL}/oauth/token`, {
    client_id: RELOADLY_CLIENT_ID,
    client_secret: RELOADLY_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: BASE_URL,
  })
  return response.data.access_token
}

const getHeaders = async () => {
  const token = await getAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/com.reloadly.topups-v1+json',
  }
}

// Airtime top-up
export const purchaseAirtime = async ({
  phone,
  countryCode,
  amount,
  operatorId,
}: {
  phone: string
  countryCode: string
  amount: number
  operatorId?: number
}) => {
  const headers = await getHeaders()

  // If no operatorId, auto-detect
  if (!operatorId) {
    const detect = await axios.get(
      `${BASE_URL}/operators/auto-detect/phone/${phone}/countries/${countryCode}`,
      { headers }
    )
    operatorId = detect.data.id
  }

  const response = await axios.post(
    `${BASE_URL}/topups`,
    {
      operatorId,
      amount,
      useLocalAmount: true,
      recipientPhone: { countryCode, number: phone },
    },
    { headers }
  )
  return response.data
}

// Data bundle
export const purchaseData = async ({
  phone,
  countryCode,
  dataOfferId,
}: {
  phone: string
  countryCode: string
  dataOfferId: number
}) => {
  const headers = await getHeaders()
  const response = await axios.post(
    `${BASE_URL}/topups`,
    {
      operatorId: dataOfferId,
      recipientPhone: { countryCode, number: phone },
    },
    { headers }
  )
  return response.data
}