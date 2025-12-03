import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from 'lucide-react'
import { useCurrentUser } from '@/services/supabase/hooks/useCurrentUser'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { createClient } from '@/services/supabase/client'
import { useRouter } from 'next/navigation'

const UserAvatar = () => {
    const { User: user, isLoading, profile } = useCurrentUser()
    const router = useRouter()

    const logout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    console.log(profile)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>

                        <TooltipContent>
                            <p>{profile?.username || user?.user_metadata?.full_name || user?.email}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                side='top'
                align='start'
                sideOffset={8}

            >
                <DropdownMenuLabel>{profile?.username || user?.user_metadata?.full_name || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} disabled={isLoading} className='cursor-pointer'>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu >
    )
}

export default UserAvatar
