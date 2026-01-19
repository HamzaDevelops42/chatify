"use client"
import { cn } from '@/lib/utils';
import { Card } from './ui/card'
import { useConversation } from '@/hooks/useConversation';
import { Loader2Icon } from 'lucide-react';

type Props = React.PropsWithChildren<{
    title: string;
    Action?: React.ReactNode
}>

const ItemList = ({ children, title, Action }: Props) => {
    const { isActive } = useConversation()
    return (
        <Card className={cn('hidden h-full w-full lg:flex-none lg:w-80 p-2', {
            block: !isActive,
            "lg:block": isActive
        })}>
            <div className='mb-4 flex items-center justify-between'>
                <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
                {Action ? Action : null}
            </div>
            <div className='w-full h-full flex flex-col items-center justify-start gap-2'>
                {children}
            </div>
        </Card>
    )
}

export default ItemList

export function ItemListLoader() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Loader2Icon className="animate-spin size-10" />
        </div>
    )
}


