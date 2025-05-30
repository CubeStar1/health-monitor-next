import React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationMobileProps {
  components: { title: string; href: string }[];
  healthItems: { title: string; href: string; description: string }[];
}

export function NavigationMobile({ components, healthItems }: NavigationMobileProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            {components.map((item) => (
              <DropdownMenuItem key={item.title}>
                <Link href={item.href} className="w-full">
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Health</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {healthItems.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <Link href={item.href} className="w-full">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}