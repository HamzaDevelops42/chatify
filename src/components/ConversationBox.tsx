import Link from 'next/link';
import React from 'react'
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';

const ConversationBox = ({ id, avatar_url, username }: { id: string; avatar_url: string | null; username: string }) => {
    return (
        <Link href={`/conversations/${id}`} className='w-full'>
            <Card className='p-2 flex flex-row items-center gap-4 truncate'>
                <div className='flex flex-row items-center gap-4 truncate'>
                    <Avatar className='flex items-center justify-center'>
                        <AvatarImage src={avatar_url ? avatar_url : ""} />
                        <AvatarFallback>
                            <User className='flex items-center justify-center'/>
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col truncate'>
                        <h4 className='truncate'> {username} </h4>
                    </div>
                </div>
            </Card>    
        </Link>
    )
}

export default ConversationBox
