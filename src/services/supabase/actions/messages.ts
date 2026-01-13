"use server"

import { actionResponse } from "@/hooks/actionResponse";
import { getCurrentUser } from "../hooks/getCurrentUser";
import { createAdminClient } from "../server"

export type Message = {
    id: string
    content: string
    created_at: string
    sender_id: string
    author: {
        username: string
        avatar_url: string | null
    }
}

export async function getMessages(chatId: string) {
    return actionResponse(async () => {

        const { User, profile } = await getCurrentUser()
        if (!User || !profile) {
            throw new Error("user not authenticated")
        }
        const supabase = await createAdminClient()

        const { data, error } = await supabase
            .from("messages")
            .select(
                "id, content, created_at, sender_id, author:profiles (username, avatar_url)"
            )
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true })
            .limit(20)
        if (error) {
            throw new Error("Error getting messages")
        }
        return {
            userId: User.id,
            data
        }
    })
}

export async function sendMessage(data: {
    id: string
    text: string
    chatId: string
}) {

    return actionResponse(async () => {

        const { User, profile } = await getCurrentUser()
        if (!User || !profile) {
            throw new Error("user not authenticated")
        }

        if (!data.text.trim()) {
            throw new Error("Message cannot be empty")
        }

        const supabase = await createAdminClient()

        const { data: membership, error: membershipError } = await supabase
            .from("chat_members")
            .select("user_id")
            .eq("chat_id", data.chatId)
            .eq("user_id", User.id)
            .single()

        if (membershipError || !membership) {
            throw new Error("User is not a member of the chat room")
        }

        const { data: message, error } = await supabase
            .from("messages")
            .insert({
                id: data.id,
                content: data.text.trim(),
                chat_id: data.chatId,
                sender_id: User.id,
            })
            .select(
                "id, content, created_at, sender_id, author:profiles (username, avatar_url)"
            )
            .single()

        if (error || !message) {
            throw new Error("Failed to send message")
        }

        const channel = supabase.channel(`chat:${data.chatId}:messages`, {
            config: {
                private: true
            }
        })

        await channel.send({
            type: "broadcast",
            event: "INSERT",
            payload: {
                id: message.id,
                content: message.content,
                created_at: message.created_at,
                sender_id: User.id,
                author: {
                    username: profile.username,
                    avatar_url: profile.avatar_url
                }
            },
        })

        return { message }
    })

}