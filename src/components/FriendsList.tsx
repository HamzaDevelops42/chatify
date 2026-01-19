import { FriendRequestType, getFriendRequests } from '@/services/supabase/actions/friends'
import React from 'react'
import FriendsError from './FriendsError'
import FriendRequest from './friendRequest'

const FriendsList = async () => {
    const response = await getFriendRequests()
    const requests: FriendRequestType[] = response?.data?.data
    return (
        <>
            {
                response.success === false ? <FriendsError error={response.error} />
                    : requests && (requests.length === 0 ? (
                        <p className='w-full h-full flex items-center justify-center'>No Friend requests found</p>
                    ) : (
                        requests.map((request, i) => (<FriendRequest key={i} id={request.id} username={request.sender.username} avatarUrl={request.sender?.avatar_url} />))
                    ))
            }
        </>

    )
}

export default FriendsList
