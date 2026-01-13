"use client"
import { cn } from "@/lib/utils"
import { Message } from "@/services/supabase/actions/messages"
import { User } from "lucide-react"
import { Ref, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"


const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
})

export function ChatMessage({
    content,
    author,
    created_at,
    status,
    fromCurrentuser,
    ref,
}: Message & {
    status?: "pending" | "error" | "success"
    ref?: Ref<HTMLDivElement>
    fromCurrentuser: boolean
}) {

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-end ", {
                "justify-end": fromCurrentuser
            })}>

            <div className={cn(
                "flex flex-col w-full mx-2",
                {
                    "order1 items-end": fromCurrentuser,
                    "order-2 items-start": !fromCurrentuser
                }
            )}>
                <div className={cn(
                    "px-4 py-2 rounded-lg max-w-[70%]",
                    {
                        "bg-primary text-primary-foreground": fromCurrentuser,
                        "bg-secondary text-secondary-foreground": !fromCurrentuser,
                        "opacity-70": status === "pending",
                        "bg-destructive/10 text-destructive": status === "error"
                    }
                )}>

                    <p className="text-wrap wrap-break-word whitespace-pre-wrap">{content}</p>
                    <p className={cn(
                        "text-xs flex w-full my-1", {
                        "text-primary-foreground justify-end": fromCurrentuser,
                        "text-secondary-foreground justify-start": !fromCurrentuser
                    }
                    )}>
                        {mounted && DATE_FORMATTER.format(new Date(created_at))}
                    </p>

                </div>
            </div>

            <Avatar className={cn(
                "relative w-8 h-8 self-center", {
                "order-2": fromCurrentuser,
                "order-1": !fromCurrentuser
            }
            )}>
                <AvatarImage src={author.avatar_url ?? ""} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}