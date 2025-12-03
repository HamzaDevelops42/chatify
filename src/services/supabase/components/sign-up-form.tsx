'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/services/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SocialLoginForm } from './social_auth_button'
import { CheckIcon, Loader2, XIcon } from 'lucide-react'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)

  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (!isUsernameAvailable) {
      setError("Username is already taken")
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/conversations`,
          data: {
            username: username
          }
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!username.trim()) {
      setIsUsernameAvailable(null)
      return
    }
    setIsCheckingUsername(true)
    setIsUsernameAvailable(null)

    const timeout = setTimeout(async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle()

      setIsUsernameAvailable(!data)
      setIsCheckingUsername(false)
    }, 500) //  debounce delay

    return () => clearTimeout(timeout)
  }, [username])


  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder=""
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                />
                {isCheckingUsername && (
                  <span className='flex items-center gap-2'>
                    <Loader2 className="animate-spin size-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Checking availability...</p>

                  </span>
                )}

                {isUsernameAvailable === true && (
                  <span className='flex items-center gap-2'>
                    <CheckIcon className='size-4 text-green-600 dark:text-green-400' />
                    <p className="text-xs text-green-600"><></>Username is available </p>
                  </span>
                )}

                {isUsernameAvailable === false && (
                  <span className='flex items-center gap-2'>
                    <XIcon className='text-red-400 size-4' />
                    <p className="text-xs text-red-400">Username is already taken </p>
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading || isUsernameAvailable === false || isCheckingUsername}>
                {isLoading ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>

          </form>
          <div className='mt-3'>
            <SocialLoginForm />

          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
