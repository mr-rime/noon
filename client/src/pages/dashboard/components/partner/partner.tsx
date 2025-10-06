import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { PartnerLogin } from '../partner-login/partner-login'
import { PartnerRegister } from '../partner-register/partner-register'

export function PartnerPage() {
  const page = useSearch({
    from: '/(dashboard)/partners/',
    select: (state) => state.page,
  })
  const [form, setForm] = useState<'login' | 'register'>(page || 'login')
  return (
    <div className="partner-container">
      {form === 'login' ? <PartnerLogin setForm={setForm} /> : <PartnerRegister setForm={setForm} />}
    </div>
  )
}
