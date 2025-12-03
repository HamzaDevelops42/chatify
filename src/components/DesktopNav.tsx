import { useNavigation } from '@/hooks/useNavigation'
import { Card } from './ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import Link from 'next/link'
import UserAvatar from './UserAvatar'
import { ThemeToggle } from './ThemeToggle'

const DesktopNav = () => {
    const paths = useNavigation()

    return (
        <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4'>
            <nav>
                <ul className='flex flex-col items-center gap-4'>{
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

                </ul>
            </nav>
            <div className='flex flex-col items-center gap-4'>
                <ThemeToggle/>
                <UserAvatar/>
            </div>
        </Card>
    )
}

export default DesktopNav
