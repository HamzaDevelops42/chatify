import { useNavigation } from '@/hooks/useNavigation'
import { Card } from './ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import Link from 'next/link'
import UserAvatar from './UserAvatar'
import { ThemeToggle } from './ThemeToggle'
import { useConversation } from '@/hooks/useConversation'

const MobileNav = () => {
    const paths = useNavigation()
    const { isActive } = useConversation()

    if(isActive) return null
    return (
        <Card className='fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16  lg:hidden'>
            <nav className='w-full h-full'>
                <ul className='h-full flex justify-evenly items-center'>{
                    paths.map((path, index) => (
                        <li key={index} className='relative'>
                            <Link href={path.href}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant={path.active ? "default" : "outline"}
                                        >
                                            {path.icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent >
                                        <p >{path.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Link>


                        </li>
                    ))
                }

                    <li>
                        <ThemeToggle />
                    </li>
                    <li>
                        <UserAvatar />
                    </li>

                </ul>
            </nav>

        </Card>
    )
}

export default MobileNav
