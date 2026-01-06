import ConversationBox from "@/components/ConversationBox";
import ItemList from "@/components/ItemList";
import { DirectConversation, getDirectConversations } from "@/services/supabase/actions/conversations";

export default async function ConversationsLayout({ children }: React.PropsWithChildren<{}>) {
    const conversations: DirectConversation[] = await (await getDirectConversations())?.data?.data
    console.log(conversations)
    return (
        <>
            <ItemList title="Conversations">
                {
                    conversations.length === 0 ? <p className="w-full h-full flex items-center justify-center">No conversations found</p> : conversations.map(conversation => (<ConversationBox key={conversation.user.id} id={conversation.user.id} username={conversation.user.username} avatar_url={conversation.user.avatar_url} />))
                }
            </ItemList>
            {children}
        </>
    );
}
