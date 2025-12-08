import AddFriendDialog from '@/components/AddFriendDialog'
import ConversationsFallback from '@/components/ConversationsFallback'
import ItemList from '@/components/ItemList'

function FriendsPage() {
  return (
    <>
      <ItemList title='Friends' Action={<AddFriendDialog/>}>Friends Page</ItemList>
      <ConversationsFallback />
    </>
  )
}

export default FriendsPage
