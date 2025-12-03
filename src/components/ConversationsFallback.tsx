import React from 'react'
import { Card } from './ui/card'

const ConversationsFallback = () => {
    return (
        <Card className='hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground'>
            Select a conversation to get started!
        </Card>
    )
}

export default ConversationsFallback
