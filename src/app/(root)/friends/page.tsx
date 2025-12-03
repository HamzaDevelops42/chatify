import ConversationsFallback from '@/components/ConversationsFallback'
import ItemList from '@/components/ItemList'

function FriendsPage() {
  return (
    <>
      <ItemList title='Friends'>Friends Page</ItemList>
      <ConversationsFallback />
    </>
  )
}

export default FriendsPage
