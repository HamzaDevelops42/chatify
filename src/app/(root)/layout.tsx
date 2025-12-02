
import SidebarWrapper from "@/components/SidebarWrapper";


export default function Layout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
        <SidebarWrapper>{children}</SidebarWrapper>
        </>

    );
}
