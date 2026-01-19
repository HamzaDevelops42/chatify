import { Skeleton } from "@/components/ui/skeleton"

const ChatLoadingSkeleton = () => {
    return (
        <>

            <div className="w-full flex items-center gap-3 p-2 rounded-lg border">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex-1 w-full overflow-hidden flex flex-col-reverse gap-3 p-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"
                            }`}
                    >
                        <Skeleton
                            className={`h-10 rounded-xl ${i % 2 === 0 ? "w-64" : "w-48"
                                }`}
                        />
                    </div>
                ))}
            </div>

            <div className="p-3 flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
        </>
    )
}

export default ChatLoadingSkeleton
