'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function SocialLoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/conversations`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>

      <form onSubmit={handleSocialLogin}>
        <div className="flex flex-col gap-6">
          {error && <p className="text-sm text-destructive-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading} variant={"outline"}>
            {isLoading ? 'Logging in...' : 'Continue with Google'}
          </Button>
        </div>
      </form>

    </div>
  )
}
