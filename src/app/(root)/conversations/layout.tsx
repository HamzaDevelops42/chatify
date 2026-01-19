import ConversationsList from "@/components/ConversationsList";
import ItemList, { ItemListLoader } from "@/components/ItemList";
import { Suspense } from "react";

export default async function ConversationsLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <ItemList title="Conversations">
                <Suspense fallback={<ItemListLoader/>}>
                    <ConversationsList />
                </Suspense>
            </ItemList>
            {children}
        </>
    );
}
