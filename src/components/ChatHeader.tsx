"use client"
import { Card } from './ui/card';
import Link from 'next/link';
import { CircleArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const ChatHeader = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
    return (
        <Card className='w-full flex rounded-lg items- justify-between p-2'>
            <div className='flex items-center gap-2'>
                <Link href="/conversations" className='block lg:hidden'>
                    <CircleArrowLeft />
                </Link>
                <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <h2 className='font-semibold'>{name}</h2>
            </div>

        </Card>
    )
}

export default ChatHeader
