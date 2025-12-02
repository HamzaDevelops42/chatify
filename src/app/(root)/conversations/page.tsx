import { redirect } from 'next/navigation'

import { LogoutButton } from '@/services/supabase/components/logout-button'
import { createClient } from '@/services/supabase/server'

export default async function ConersationsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="">
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
