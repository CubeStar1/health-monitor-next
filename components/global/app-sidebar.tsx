"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSection } from "@/components/navigation/nav-section"
import { NavProfile } from "@/components/navigation/nav-profile"
import useUser from "@/hooks/use-user"
import ManageProfile from "@/components/supaauth/manage-profile"
import Image from "next/image"
import sidebarConfig from "@/lib/config/sidebar"

export function AppSidebar() {
  const { data: user } = useUser()

  if (!user) return null

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="px-6 py-4 border-b flex items-center gap-2">
            <Image src="/idea-lab-round.png" alt="Logo" width={40} height={40} />
            <h1 className="text-sm font-semibold">{sidebarConfig.brand.title}</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="">
          <div className="">
            {sidebarConfig.sections.map((section, index) => (
              <NavSection 
                key={index}
                label={section.label} 
                items={section.items}
                collapsible={section.collapsible}
                icon={section.icon}
                collapsibleTitle={section.collapsibleTitle}
              />
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter className="px-2">
          <NavProfile user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <ManageProfile />
    </>
  )
}