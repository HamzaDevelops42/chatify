import ConversationBox from "@/components/ConversationBox"
import { DirectConversation, getDirectConversations } from "@/services/supabase/actions/conversations"

export default async function ConversationsList() {
    const conversations: DirectConversation[] = (await getDirectConversations())?.data?.data
    return (
        <>
            {
                conversations.length === 0 ? (
                    <p className="w-full h-full flex items-center justify-center">
                        No conversations found
                    </p>
                ) : (
                    conversations.map(conversation => (
                        <ConversationBox
                            key={conversation.chat_id}
                            id={conversation.chat_id}
                            username={conversation.user.username}
                            avatar_url={conversation.user.avatar_url}
                        />
                    ))
                )
            }
        </>
    )
}


