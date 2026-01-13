"use client"
import ConversationsContainer from './ConversationContainer'
import { toast } from 'sonner'

const ConversationNotFound = () => {
    return (
        <ConversationsContainer>
            <p className='w-full h-full flex items-center justify-center'>Conversation not found</p>
        </ConversationsContainer>
    )
}

export default ConversationNotFound
