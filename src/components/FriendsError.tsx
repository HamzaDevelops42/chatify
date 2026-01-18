'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function FriendsError({ error }: { error: string }) {
    useEffect(() => {
        toast.error(error)
    }, [error])

    return (
        <p className="w-full h-full flex items-center justify-center text-red-500">
            Failed to load friend requests
        </p>
    )
}
