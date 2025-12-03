import ItemList from "@/components/ItemList";

export default function ConversationsLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <ItemList title="Conversations">
        Conversations Page
            </ItemList>
            {children}
        </>
    );
}
