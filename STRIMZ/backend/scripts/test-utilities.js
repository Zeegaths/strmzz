require('dotenv').config()
const axios = require('axios')

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api/v1/utilities`

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const run = async () => {
  console.log('🧪 Strimz Utilities Tests')
  console.log(`Target: ${BASE_URL}\n`)

  console.log('─────────────────────────────────')
  console.log('Test: Get MTN Data Variations')
  try {
    const res = await api.get('/variations?serviceID=mtn-data&type=data')
    console.log('Status:', res.status)
    console.log('Response:', JSON.stringify(res.data, null, 2))
  } catch (err) {
    console.log('Error:', err.response?.data || err.message)
  }

  console.log('\n─────────────────────────────────')
  console.log('Test: Get TV Variations (DSTV)')
  try {
    const res = await api.get('/variations?serviceID=dstv&type=tv')
    console.log('Status:', res.status)
    console.log('Response:', JSON.stringify(res.data, null, 2))
  } catch (err) {
    console.log('Error:', err.response?.data || err.message)
  }

  console.log('\n─────────────────────────────────')
  console.log('Test: Purchase Airtime')
  try {
    const res = await api.post('/purchase?type=airtime', {
      serviceID: 'mtn',
      amount: '100',
      phone: '08030224350',
    })
    console.log('Status:', res.status)
    console.log('Response:', JSON.stringify(res.data, null, 2))
  } catch (err) {
    console.log('Error:', err.response?.data || err.message)
  }

  console.log('\n─────────────────────────────────')
  console.log('Test: Verify Electricity')
  try {
    const res = await api.post('/verify?type=electricity', {
      serviceID: 'ikeja-electric',
      billersCode: '1234567890',
      variation_code: 'prepaid',
    })
    console.log('Status:', res.status)
    console.log('Response:', JSON.stringify(res.data, null, 2))
  } catch (err) {
    console.log('Error:', err.response?.data || err.message)
  }

  console.log('\n✅ All utility tests sent')
}

run().catch(console.error)
