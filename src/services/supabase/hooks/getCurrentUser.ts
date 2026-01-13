"use server"
import { cache } from "react"
import { createClient } from "../server"

export const getCurrentUser = cache(async () => {
    const supabase = await createClient()
    const User = (await supabase.auth.getUser()).data.user

    if (!User) {
        throw new Error("User not authenticated")
    }
    const { data: profile, error } = await supabase.from("profiles").select("id, username, avatar_url").eq("id", User.id).single()

    if (error) {
        throw new Error("Unable to find user profile")
    }
    return { User, profile }
})