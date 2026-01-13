import { ChatBody } from '@/components/ChatBody'
import ChatHeader from '@/components/ChatHeader'
import { ChatInput } from '@/components/ChatInput'
import ConversationsContainer from '@/components/ConversationContainer'
import ConversationNotFound from '@/components/ConversationNotFound'
import { getDm } from '@/services/supabase/actions/conversations'
import { getMessages } from '@/services/supabase/actions/messages'
import { getCurrentUser } from '@/services/supabase/hooks/getCurrentUser'
import { useCurrentUser } from '@/services/supabase/hooks/useCurrentUserClient'
import { channel } from 'diagnostics_channel'
import { toast } from 'sonner'

async function page({ params }: { params: Promise<{ conversationId: string }> }) {

  const { conversationId } = await params
  const response = await getDm(conversationId)
  if (response.success === false || !response.data.data) {
    return <ConversationNotFound />
  }
  const messages = await getMessages(conversationId)
  const {profile} = await getCurrentUser()
console.log(profile)

  return (
    <ConversationsContainer>
      <ChatHeader name={response.data.data.user.username} avatarUrl={response.data.data.user.avatar_url} />
      <ChatBody messages={messages.data.data} chatId={conversationId} user={profile} />
    </ConversationsContainer>
  )
}

export default page
