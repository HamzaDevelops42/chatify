import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { createClient } from "../client"

type Profile = {
    id: string
    username: string
    avatar_url: string | null
}

export function useCurrentUser() {
    const [isLoading, setIsLoading] = useState(true)
    const [User, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function loadUser() {
            setIsLoading(true)

            const { data } = await supabase.auth.getUser()
            const authUser = data.user
            setUser(authUser)

            if (authUser) {
                const { data: profileData } = await supabase.from("profiles").select("id, username, avatar_url").eq("id", authUser.id).single()
                setProfile(profileData)
            }

            setIsLoading(false)
        }

        loadUser()

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })



        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])


    return { User, isLoading, profile }
}