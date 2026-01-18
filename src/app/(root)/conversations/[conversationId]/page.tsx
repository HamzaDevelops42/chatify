import { ChatBody } from '@/components/ChatBody'
import ChatHeader from '@/components/ChatHeader'
import ConversationsContainer from '@/components/ConversationContainer'
import ConversationNotFound from '@/components/ConversationNotFound'
import { getDm } from '@/services/supabase/actions/conversations'
import { getMessages } from '@/services/supabase/actions/messages'
import { getCurrentUser } from '@/services/supabase/hooks/getCurrentUser'

async function page({ params }: { params: { conversationId: string } }) {
  const { conversationId } = await params

  const [response, messages, user] = await Promise.all([
    getDm(conversationId),
    getMessages(conversationId),
    getCurrentUser()
  ])
  if (!response.success || !response.data.data) return <ConversationNotFound />

  return (
    <ConversationsContainer>
      <ChatHeader
        name={response.data.data.user.username}
        avatarUrl={response.data.data.user.avatar_url}
      />
      <ChatBody
        messages={messages.data.data}
        chatId={conversationId}
        user={user.profile}
      />
    </ConversationsContainer>
  )
}
export default page