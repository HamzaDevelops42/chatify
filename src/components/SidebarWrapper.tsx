"use client"
import { useNavigation } from "@/hooks/useNavigation"
import DesktopNav from "./DesktopNav"
import MobileNav from "./MobileNav"

const SidebarWrapper = ({ children }: React.PropsWithChildren<{}>) => {
  const path = useNavigation()
  return (
    <div className="h-full w-full p-4 flex flex-col lg:flex-row gap-4">
      <MobileNav/>
      <DesktopNav />
      <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">
        {children}
      </main>
    </div>
  )
}

export default SidebarWrapper
