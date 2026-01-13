"use client"

import { ChatInput } from "@/components/ChatInput"
import { ChatMessage } from "@/components/ChatMessage"
import { Message } from "@/services/supabase/actions/messages"
import { useRealtimeChat } from "@/hooks/useRealtime"
import { useState } from "react"
import { useInfiniteScrollChat } from "@/hooks/useInfiniteScroll"
import { Button } from "./ui/button"

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

  const {
    loadMoreMessages,
    messages: oldMessages,
    status,
    triggerQueryRef,
  } = useInfiniteScrollChat({
    chatId: chatId,
    startingMessages: messages.toReversed(),
  })

  const { messages: realtimeMessages } = useRealtimeChat({
    chatId: chatId,
    userId: user.id,
  })



  const visibleMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter(m => !realtimeMessages.find(rm => rm.id === m.id))
  )
  return (<>
    <div>
      {status === "loading" && (
        <p className="text-center text-sm text-muted-foreground py-2">
          Loading more messages...
        </p>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-sm text-destructive py-2">
            Error loading messages.
          </p>
          <Button onClick={loadMoreMessages} variant="outline">
            Retry
          </Button>
        </div>
      )}
    </div>
    <div className="flex-1 w-full overflow-y-scroll flex flex-col-reverse gap-2 p-3 no-scrollbar">

      {visibleMessages.toReversed().map((message, index) => (
        <ChatMessage
          key={message.id}
          {...message}
          ref={index === (visibleMessages.length - 1) && status === "idle" ? triggerQueryRef : null}
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