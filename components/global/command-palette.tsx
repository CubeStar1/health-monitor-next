"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import sidebarConfig from "@/lib/config/sidebar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      <button
        className="inline-flex h-9 w-fit rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <Search
            className="-ms-1 me-3 text-muted-foreground/80"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="font-normal text-muted-foreground/70">Search</span>
        </span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarConfig.sections.map((section) => (
            <CommandGroup key={section.label} heading={section.label}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem key={item.href} onSelect={() => navigate(item.href)}>
                    <Icon size={16} strokeWidth={2} className="mr-2 opacity-60" aria-hidden="true" />
                    <span>{item.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
