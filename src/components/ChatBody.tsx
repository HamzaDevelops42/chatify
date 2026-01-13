"use client"

import { ChatInput } from "@/components/ChatInput"
import { ChatMessage } from "@/components/ChatMessage"
import { Message } from "@/services/supabase/actions/messages"
import { useRealtimeChat } from "@/hooks/useRealtime"
import { useState } from "react"

export function ChatBody({ chatId, messages, user }: {
  chatId: string;
  messages: Message[],
  user: {
    id: string;
    username: string;
    avatar_url: string
  }
}) {

  const [sentMessages, setSentMessages] = useState<
    (Message & { status: "pending" | "error" | "success" })[]
  >([])

  const { messages: realtimeMessages } = useRealtimeChat({
    chatId: chatId,
    userId: user.id,
  })

  const visibleMessages = messages.concat(
    realtimeMessages,
    sentMessages.filter(m => !realtimeMessages.find(rm => rm.id === m.id))
  )
  console.log(visibleMessages)

  return (<>
    <div className="flex-1 w-full overflow-y-scroll flex flex-col-reverse gap-2 p-3 no-scrollbar">

      {visibleMessages.toReversed().map((message, index) => (
        <ChatMessage
          key={message.id}
          {...message}
          // ref={index === 0 && status === "idle" ? triggerQueryRef : null}
          fromCurrentuser={message.sender_id === user.id}
        />
      ))}
    </div>
    <ChatInput chatId={chatId} onSend={(message) => {
      setSentMessages(prev => [
        ...prev,
        {
          id: message.id,
          content: message.text,
          created_at: new Date().toISOString(),
          sender_id: user.id,
          author: {
            username: user.username,
            avatar_url: user.avatar_url,
          },
          status: "pending",
        },
      ])
    }} onSuccessfulSend={(message) => {
      setSentMessages(prev =>
        prev.map(m =>
          m.id === message.id ? { ...message, status: "success" } : m
        )
      )
    }} onErrorSend={(id) => {
      setSentMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, status: "error" } : m))
      )
    }} />

  </>
  )
}