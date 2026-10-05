import { useEffect, useState } from 'react'

const KEY = 'nxtwave:first-valid-referral'

export function useReferral() {
  const [referralCode, setReferralCode] = useState(() => sessionStorage.getItem(KEY) || '')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incoming = (params.get('ref') || '').trim()
    if (incoming && !sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, incoming)
      setReferralCode(incoming)
    }
  }, [])

  return referralCode
}
