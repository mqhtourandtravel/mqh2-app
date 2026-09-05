"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  FilePlus2Icon,
  LayoutTemplateIcon,
  Menu,
  Moon,
  PaletteIcon,
  PenToolIcon,
  SearchIcon,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
  { name: "Contact", href: "#link" },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setScrolled(window.scrollY / max > 0.05);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className={cn(
          "fixed z-20 h-14 w-full border-b bg-background/50 backdrop-blur-xl transition-colors duration-150",
          scrolled && "bg-background/80",
        )}
      >
        <div className="h-full px-3 transition-all duration-300">
          <div className="relative flex h-full flex-wrap items-center justify-between gap-3 lg:gap-0">
            <div className="flex h-full w-full items-center justify-between gap-6 lg:w-auto">
              <a
                href="#"
                aria-label="home"
                className="-mr-3 flex items-center gap-2 whitespace-nowrap"
              >
                <LogoMark />
              </a>

              <Separator className="hidden lg:block" orientation="vertical" />

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 mr-2 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-10 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:h-14 lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator orientation="vertical" />
              <Search />
              <Separator orientation="vertical" />
              <ModeToggle />
              <Separator orientation="vertical" />
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href="#">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="#">
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

function LogoMark() {
  return (
    <span className="flex size-10 items-center justify-center rounded-md bg-foreground text-background">
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="m12 12 8-4.5" />
        <path d="M12 12v9" />
      </svg>
    </span>
  );
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className="size-9" aria-hidden="true" />;
  }
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md bg-secondary text-foreground transition-colors hover:bg-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Moon className="size-4" aria-hidden="true" />
      ) : (
        <Sun className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

interface SearchItem {
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  label: string;
  shortcut?: string;
}

interface SearchGroup {
  heading: string;
  items: SearchItem[];
}

const searchGroups: SearchGroup[] = [
  {
    heading: "Create",
    items: [
      { icon: FilePlus2Icon, label: "New project", shortcut: "⌘N" },
      { icon: LayoutTemplateIcon, label: "New template", shortcut: "⌘T" },
      { icon: PenToolIcon, label: "Start design", shortcut: "⌘S" },
    ],
  },
  {
    heading: "Navigate",
    items: [
      { icon: ArrowUpRightIcon, label: "Go to workspace" },
      { icon: ArrowUpRightIcon, label: "Go to assets" },
      { icon: ArrowUpRightIcon, label: "Go to documentation" },
    ],
  },
  {
    heading: "Themes",
    items: [{ icon: PaletteIcon, label: "Switch theme", shortcut: "⌘⇧T" }],
  },
];

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((value) => !value);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const q = query.trim().toLowerCase();
  const groups = searchGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        q ? item.label.toLowerCase().includes(q) : true,
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <button
        type="button"
        className="hidden h-9 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:inline-flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="-ms-1 me-3 text-muted-foreground/80"
            size={16}
            aria-hidden="true"
          />
          <span className="font-normal text-muted-foreground/70">
            Search designs...
          </span>
        </span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-lg overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-3">
              <SearchIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search components, assets, or docs..."
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {groups.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No matches found.
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.heading} className="mb-2 last:mb-0">
                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {group.heading}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.label}>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setOpen(false)}
                            >
                              <Icon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                              />
                              <span className="flex-1">{item.label}</span>
                              {item.shortcut ? (
                                <span className="text-xs tracking-widest text-muted-foreground">
                                  {item.shortcut}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Header;
