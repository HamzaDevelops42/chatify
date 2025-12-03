import React from 'react'
import { Card } from './ui/card'

const ConversationsContainer = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <Card className='w-full h-[calc(100svh-32px)] lg:h-full p-2 flex flex-col gap-2'>
            {children}
        </Card>
    )
}

export default ConversationsContainer
