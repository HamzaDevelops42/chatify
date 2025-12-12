"use server"
import { createAdminClient } from "../server";
import { getCurrentUser } from "../hooks/getCurrentUser";
import { actionResponse } from "@/hooks/actionResponse";


export async function sendFriendRequest(username: string) {

    return actionResponse(async () => {

        const { User, profile } = await getCurrentUser()
        if (!User || !profile) {
            throw new Error("user not authenticated")
        }

        const supabsae = await createAdminClient()

        const { data: receiver } = await supabsae.from("profiles").select("id, username").eq("username", username).single()

        if (!receiver) {
            throw new Error("User does not exist")
        }

        const { data: requestAlreadySent } = await supabsae.from("friend_requests").select("id").eq("sender_id", User.id).eq("receiver_id", receiver.id).eq("status", "pending").single()

        if (requestAlreadySent) {
            throw new Error("You have already sent a request")
        }

        const { data: requestAlreadyRecieved } = await supabsae.from("friend_requests").select("id").eq("sender_id", receiver.id).eq("receiver_id", User.id).eq("status", "pending").single()

        if (requestAlreadyRecieved) {
            throw new Error("The user has already sent you a request")
        }

        const { data: alreadyFriends } = await supabsae
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

        const { error: insertError } = await supabsae.from("friend_requests").insert({
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

