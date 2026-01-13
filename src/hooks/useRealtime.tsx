import { Message } from "@/services/supabase/actions/messages"
import { createClient } from "@/services/supabase/client"
import { RealtimeChannel } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export const useRealtimeChat = ({
    chatId,
    userId,
}: {
    chatId: string
    userId: string
}) => {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const supabase = createClient()
        let newChannel: RealtimeChannel
        let cancel = false

        supabase.realtime.setAuth().then(() => {
            if (cancel) return
            newChannel = supabase.channel(`chat:${chatId}:messages`, {
                config: {
                    private: true
                }
            })


            newChannel
                .on("broadcast", { event: "INSERT" }, payload => {
                    const record = payload.payload
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            id: record.id,
                            content: record.content,
                            created_at: record.created_at,
                            sender_id: record.sender_id,
                            author: record.author
                        },
                    ])
                })
                .subscribe((status) => {
                    if (status !== "SUBSCRIBED") return
                })

        })

        return () => {
            cancel = true
            if (!newChannel) return
            newChannel.unsubscribe()
        }
    }, [chatId, userId])

    return { messages }
}