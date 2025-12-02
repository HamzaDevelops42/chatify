import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { createClient } from "../client"

export function useCurrentUser() {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setuser] = useState<User | null>(null)

    useEffect(() => {
        const supabase = createClient()

        supabase.auth
            .getUser()
            .then(({ data }) => {
                setuser(data.user)
            })
            .finally(() => {
                setIsLoading(false)
            })

        const { data } = supabase.auth.onAuthStateChange((_, session) => {
            setuser(session?.user ?? null)
        })


        return () => {
            data.subscription.unsubscribe()
        }

    }, [])


    return { user, isLoading }
}