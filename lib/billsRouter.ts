import { detectCountry, toVTPassServiceId } from './detectCountry'
import * as reloadly from './reloadly'

// VTPass is CommonJS from your existing setup
const vtpass = require('../helpers/vtpass') // adjust path to your existing vtpass file

export type BillPreference = {
  type: 'airtime' | 'data' | 'electricity' | 'cable'
  provider: string
  phone?: string
  meter?: string
  iuc?: string
  plan?: string
  email: string
  amount: string
}

export const fulfillBill = async (preference: BillPreference) => {
  const phone = preference.phone || preference.meter || preference.iuc || ''
  const { provider: providerName, country } = detectCountry(phone)

  console.log(`[Bills] Routing ${preference.type} to ${providerName} (${country})`)

  if (providerName === 'reloadly') {
    return fulfillWithReloadly(preference, country)
  }

  return fulfillWithVTPass(preference)
}

// ── VTPass (Nigeria) ──────────────────────────────────────────────────────

const fulfillWithVTPass = async (pref: BillPreference) => {
  const serviceID = toVTPassServiceId(pref.provider, pref.type)

  switch (pref.type) {
    case 'airtime':
      return vtpass.purchase({
        serviceID,
        phone: pref.phone,
        amount: parseFloat(pref.amount),
        billersCode: pref.phone,
        variation_code: 'prepaid',
      })

    case 'data':
      return vtpass.purchase({
        serviceID,
        billersCode: pref.phone,
        variation_code: pref.plan,
        phone: pref.phone,
        amount: parseFloat(pref.amount),
      })

    case 'electricity':
      return vtpass.purchase({
        serviceID,
        billersCode: pref.meter,
        variation_code: 'prepaid',
        amount: parseFloat(pref.amount),
        phone: pref.phone,
      })

    case 'cable':
      return vtpass.purchase({
        serviceID,
        billersCode: pref.iuc,
        variation_code: pref.plan,
        amount: parseFloat(pref.amount),
        phone: pref.phone,
        subscription_type: 'change',
      })

    default:
      throw new Error(`Unsupported bill type: ${pref.type}`)
  }
}

// ── Reloadly (Kenya) ──────────────────────────────────────────────────────

const fulfillWithReloadly = async (pref: BillPreference, countryCode: string) => {
  switch (pref.type) {
    case 'airtime':
      return reloadly.purchaseAirtime({
        phone: pref.phone!,
        countryCode,
        amount: parseFloat(pref.amount),
      })

    case 'data':
      return reloadly.purchaseData({
        phone: pref.phone!,
        countryCode,
        dataOfferId: parseInt(pref.plan || '0'),
      })

    // Electricity and Cable not available in Kenya via Reloadly
    // Add a separate Kenyan provider here later (e.g. Africa's Talking)
    default:
      throw new Error(`${pref.type} not yet supported in Kenya`)
  }
}