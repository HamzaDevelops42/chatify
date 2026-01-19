import AddFriendDialog from '@/components/AddFriendDialog'
import ConversationsFallback from '@/components/ConversationsFallback'
import FriendsError from '@/components/FriendsError'
import FriendsList from '@/components/FriendsList'
import ItemList, { ItemListLoader } from '@/components/ItemList'
import FriendRequest from '@/components/friendRequest'
import { FriendRequestType, getFriendRequests } from '@/services/supabase/actions/friends'
import { Suspense } from 'react'
import { toast } from 'sonner'

async function FriendsPage() {
  return (
    <>
      <ItemList title='Friends' Action={<AddFriendDialog />}>
        <Suspense fallback={<ItemListLoader />}>
          <FriendsList />
        </Suspense>
      </ItemList>
      <ConversationsFallback />
    </>
  )
}

export default FriendsPage
