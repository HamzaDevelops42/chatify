"use server"
import { createAdminClient } from "../server";
import { getCurrentUser } from "../hooks/getCurrentUser";
import { actionResponse } from "@/hooks/actionResponse";

export type FriendRequestType = {
    id: string
    status: string
    created_at: string
    sender: {
        id: string
        username: string
        avatar_url: string | null
    }
}

export async function sendFriendRequest(username: string) {

    return actionResponse(async () => {

        const { User, profile } = await getCurrentUser()
        if (!User || !profile) {
            throw new Error("user not authenticated")
        }

        const supabase = await createAdminClient()

        const { data: receiver } = await supabase.from("profiles").select("id, username").eq("username", username).single()

        if (!receiver) {
            throw new Error("User does not exist")
        }

        const { data: requestAlreadySent } = await supabase.from("friend_requests").select("id").eq("sender_id", User.id).eq("receiver_id", receiver.id).eq("status", "pending").single()

        if (requestAlreadySent) {
            throw new Error("You have already sent a request")
        }

        const { data: requestAlreadyRecieved } = await supabase.from("friend_requests").select("id").eq("sender_id", receiver.id).eq("receiver_id", User.id).eq("status", "pending").single()

        if (requestAlreadyRecieved) {
            throw new Error("The user has already sent you a request")
        }

        const { data: alreadyFriends } = await supabase
            .from("friend_requests")
            .select("id")
            .or(
                `and(sender_id.eq.${User.id},receiver_id.eq.${receiver.id}),` +
                `and(sender_id.eq.${receiver.id},receiver_id.eq.${User.id})`
            )
            .eq("status", "accepted")
            .maybeSingle();


        if (alreadyFriends) {
            throw new Error("You are already Friends")
        }

        if (User.id === receiver.id) {
            throw new Error("You can't send a request to yourself")
        }

        const { error: insertError } = await supabase.from("friend_requests").insert({
            sender_id: User.id,
            receiver_id: receiver.id,
            status: "pending"
        })

        if (insertError) {
            throw new Error("There was an error sending request")
        }
        return {
            message: "Friend request sent successfully",
        }

    })
}


export async function getFriendRequests() {
    return actionResponse(async () => {

        const { User } = await getCurrentUser()
        if (!User) {
            throw new Error("user not authenticated")
        }

        const supabase = await createAdminClient()

        const { data, error } = await supabase
            .from("friend_requests")
            .select(`
        id,
        status,
        created_at,
        sender:sender_id (
        id,
        username,
        avatar_url
        )
    `)
            .eq("receiver_id", User.id)
            .eq("status", "pending")

        if (error) {
            throw new Error("Failed to fetch friend requests")
        }

        // The Below code is to normalize the types as typeScript thinks that the sender property is an array of objects 
        const normalizedData: FriendRequestType[] =
            data?.map((row: any) => ({
                id: row.id,
                status: row.status,
                created_at: row.created_at,
                sender: row.sender,
            })) ?? []

        return {
            message: "Friend request Fetched successfully",
            data: normalizedData,
        }
    })
}

