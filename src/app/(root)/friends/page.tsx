import AddFriendDialog from '@/components/AddFriendDialog'
import ConversationsFallback from '@/components/ConversationsFallback'
import ItemList from '@/components/ItemList'
import FriendRequest from '@/components/friendRequest'
import { FriendRequestType, getFriendRequests } from '@/services/supabase/actions/friends'
import { toast } from 'sonner'

async function FriendsPage() {
  const response = await getFriendRequests()
  if(!response.success){
    toast.error(response.error)
  }
  const requests: FriendRequestType[] = response.data.data
  return (
    <>
      <ItemList title='Friends' Action={<AddFriendDialog />}>
        {requests &&
          (requests.length === 0 ? (<p className='w-full h-full flex items-center justify-center'>No Friend requests found</p>) :
            (requests.map((request, i) => (<FriendRequest key={i} id={request.id} username={request.sender.username} avatarUrl={request.sender?.avatar_url} />))))
        }
      </ItemList>
      <ConversationsFallback />
    </>
  )
}

export default FriendsPage
