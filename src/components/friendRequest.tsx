"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { rejectFriendRequest } from '@/services/supabase/actions/friends';
import { Check, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const FriendRequest = ({ id, username, avatarUrl }: { id: string; username: string; avatarUrl?: string | null }) => {
const router = useRouter()

    const handleAccept = async () => {

    }
    const handleReject = async () => {
        const response = await rejectFriendRequest(id)
        if (response.success) {
            router.refresh()
            toast.success(response.data.message)
        } else {
            toast.error(response.error)
        }
    }

    return (
        <Card className='w-full p-2 flex flex-row items-center justify-between gap-2'>
            <div className='flex items-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={avatarUrl ?? undefined} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col truncate'>
                    <h4 className="truncate">{username}</h4>
                </div>


            </div>
            <div className='flex items-center gap-2'>
                <Button size="icon" onClick={handleAccept}>
                    <Check />
                </Button>
                <Button size="icon" variant="destructive" onClick={handleReject}>
                    <X />
                </Button>
            </div>
        </Card>
    )
}

export default FriendRequest
