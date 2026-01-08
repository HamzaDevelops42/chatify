"use server"

import { actionResponse } from "@/hooks/actionResponse"
import { getCurrentUser } from "../hooks/getCurrentUser"
import { createAdminClient } from "../server"

export type DirectConversation = {
    chat_id: string
    user: {
        id: string
        username: string
        avatar_url: string | null
    }
}


export async function getDirectConversations() {
    return actionResponse(async () => {
        const { User } = await getCurrentUser()
        if (!User) throw new Error("User not authenticated")

        const supabase = await createAdminClient()

        const { data: myChats, error: myChatsError } = await supabase
            .from("chat_members")
            .select("chat_id")
            .eq("user_id", User.id)

        if (myChatsError) {
            throw new Error("Failed to fetch user's chats")
        }

        const chatIds = myChats.map(c => c.chat_id)

        if (chatIds.length === 0) {
            return { data: [], message: "No conversations found" }
        }

        const { data, error } = await supabase
            .from("chat_members")
            .select(`
            chat_id,
            chats!inner (
                id,
                chat_type
            ),
            user:profiles!chat_members_user_id_fkey (
                id,
                username,
                avatar_url
            )
            `)
            .in("chat_id", chatIds)
            .neq("user_id", User.id)
            .eq("chats.chat_type", "direct")

        if (error) {
            throw new Error("Failed to fetch conversations")
        }

        return {
            message: "Conversations fetched successfully",
            data: data.map((row: any) => ({
                chat_id: row.chat_id,
                user: row.user,
            })),
        }
    })
}


export async function getDm(chatId: string) {
    return actionResponse(async () => {
        const { User } = await getCurrentUser()
        if (!User) {
            throw new Error("User not authenticated")
        }

        const supabase = await createAdminClient()
        const { data, error } = await supabase
            .from("chat_members")
            .select(`
                chat_id,
                chats!inner (
                    id,
                    chat_type
                ),
                user:profiles!chat_members_user_id_fkey (
                    id,
                    username,
                    avatar_url
                )
            `)
            .eq("chat_id", chatId)
            .eq("chats.chat_type", "direct")

        if (error || !data || data.length === 0) {
            throw new Error("Chat does not exist")
        }

        // Normalize Supabase response (user comes as array)
        const normalized = data.map((row: any) => {
            const user = Array.isArray(row.user) ? row.user[0] : row.user

            if (!user) {
                throw new Error("Invalid chat member data")
            }

            return {
                chat_id: row.chat_id,
                user: {
                    id: user.id,
                    username: user.username,
                    avatar_url: user.avatar_url,
                },
            }
        })

        const isMember = normalized.some(
            row => row.user.id === User.id
        )

        if (!isMember) {
            throw new Error("You are not a member of this chat")
        }

        const otherUser = normalized.find(
            row => row.user.id !== User.id
        )

        if (!otherUser) {
            throw new Error("Direct message participant not found")
        }

        return {
            message: "Direct message fetched successfully",
            data: {
                chat_id: chatId,
                user: otherUser.user,
            },
        }
    })
}

