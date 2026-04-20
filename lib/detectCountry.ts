type CountryInfo = {
  country: 'NG' | 'KE'
  provider: 'vtpass' | 'reloadly'
  countryCode: string
}

export const detectCountry = (phone: string): CountryInfo => {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '')

  // Kenya: +254 or 07xx/01xx local
  if (
    cleaned.startsWith('254') ||
    cleaned.startsWith('07') ||
    cleaned.startsWith('01')
  ) {
    return { country: 'KE', provider: 'reloadly', countryCode: 'KE' }
  }

  // Nigeria: +234 or 08xx/09xx/07xx local
  return { country: 'NG', provider: 'vtpass', countryCode: 'NG' }
}

// Map provider names from form to VTPass serviceIDs
export const toVTPassServiceId = (provider: string, type: string): string => {
  const map: Record<string, Record<string, string>> = {
    airtime: {
      MTN: 'mtn',
      Airtel: 'airtel',
      Glo: 'glo',
      '9mobile': 'etisalat',
    },
    data: {
      MTN: 'mtn-data',
      Airtel: 'airtel-data',
      Glo: 'glo-data',
      '9mobile': 'etisalat-data',
    },
    cable: {
      DSTV: 'dstv',
      GOTV: 'gotv',
      Startimes: 'startimes',
    },
    electricity: {
      EEDC: 'enugu-electric',
      AEDC: 'abuja-electric',
      IKEDC: 'ikeja-electric',
      EKEDC: 'eko-electric',
    },
  }
  return map[type]?.[provider] || provider.toLowerCase()
}