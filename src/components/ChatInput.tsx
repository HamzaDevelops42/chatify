"use client"

import React from "react"
import { SendIcon } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "./ui/input-group"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Message, sendMessage } from "@/services/supabase/actions/messages"

type Props = {
    chatId: string
    onSend: (message: { id: string; text: string }) => void
    onSuccessfulSend: (message: Message) => void
    onErrorSend: (id: string) => void
}

export function ChatInput({
    chatId,
    onSend,
    onSuccessfulSend,
    onErrorSend,
}: Props) {
    const [message, setMessage] = useState("")

    async function handleSubmit(e?: FormEvent) {
        e?.preventDefault()
        const text = message.trim()
        if (!text) return

        setMessage("")
        const id = crypto.randomUUID()
        onSend({ id, text })
        const result = await sendMessage({ id, text, chatId, time: new Date().toISOString() })
        if (result.error) {
            toast.error(result.error)
            onErrorSend(id)
        } else {
            onSuccessfulSend(result.data.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-3">
            <InputGroup>
                <InputGroupTextarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="field-sizing-content min-h-auto"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        type="submit"
                        aria-label="Send"
                        title="Send"
                        size="icon-sm"
                    >
                        <SendIcon />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    )
}