"use client";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ChartBarStacked,
  HomeIcon,
  Package,
  Settings,
  ListOrdered,
  Palette,
  Ruler,
  Dice4,
  Target,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useParams } from "next/navigation";

//clerk auth library
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import CreateStoreBtn from "@/app/_components/CreateStoreBtn";

const pages = [
  { icon: HomeIcon, label: "Home", path: "" },
  { icon: Target, label: "Overview", path: "/overview" },
  { icon: Dice4, label: "Billboards", path: "/billboards" },
  { icon: ChartBarStacked, label: "Category", path: "/category" },
  { icon: Ruler, label: "Sizes", path: "/size" },
  { icon: Palette, label: "Colors", path: "/color" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: ListOrdered, label: "Orders", path: "/order" },
  { icon: Settings, label: "Settings", path: "/setting" },
];

const Header = ({ isUser }: { isUser: boolean }) => {
  const params = useParams();
  const storeId = params?.storeId as string | undefined;

  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        // Handle click outside if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "") {
      return pathname === `/store/${storeId}`;
    }
    return (
      pathname === `/store/${storeId}${path}` ||
      pathname.startsWith(`/store/${storeId}${path}/`)
    );
  };

  const getPagePath = (path: string) => {
    if (!storeId) return "/";
    if (path === "") return `/`;
    return `/store/${storeId}${path}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isUser && <CreateStoreBtn />}
            {storeId &&
              pages.map((page) => {
                const pagePath = getPagePath(page.path);
                const active = isActive(page.path);
                const Icon = page.icon;

                return (
                  <Button
                    key={page.path}
                    onClick={() => router.push(pagePath)}
                    variant="ghost"
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{page.label}</span>
                    {active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
                );
              })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Navigation - FIXED: All items on one line without scroll */}
      {storeId && (
        <nav className="grid grid-cols-9 border-t md:hidden bg-background">
          {pages.map((page) => {
            const pagePath = getPagePath(page.path);
            const active = isActive(page.path);
            const Icon = page.icon;

            return (
              <Button
                key={page.path}
                onClick={() => router.push(pagePath)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 h-full relative rounded-none",
                  active
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                variant="ghost"
                size="sm"
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-medium leading-tight px-0.5">
                  {page.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;
