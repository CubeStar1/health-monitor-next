"use client"

import * as React from "react"
import Link from "next/link"
import { ModeToggle } from "./theme-switcher"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { NavigationMobile } from "./header-mobile"
import { headerConfig } from "@/lib/config/header"

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full bg-background/40 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={headerConfig.brand.icon} alt="Health Monitor" width={32} height={32} />
            <span className="text-xl font-bold">{headerConfig.brand.title}</span>
          </Link>
        </div>
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {headerConfig.navigationLinks.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              {headerConfig.sections.map((section) => (
                <NavigationMenuItem key={section.title}>
                  <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {section.items.map((item) => (
                        <ListItem
                          key={item.label}
                          title={item.label}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <nav className="flex items-center space-x-4">          
          <div className="md:hidden">
            <NavigationMobile 
              components={headerConfig.navigationLinks.map(link => ({ title: link.label, href: link.href }))} 
              healthItems={headerConfig.sections.find(s => s.title === "Health")?.items.map(item => ({ 
                title: item.label, 
                href: item.href, 
                description: item.description || "" 
              })) || []} 
            />
          </div>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"