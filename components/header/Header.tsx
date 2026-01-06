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

// import logo from "@/app/assets/logo.png";
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
      // Home is active only on exact store root
      return pathname === `/store/${storeId}`;
    }
    // Check if current path matches the page path
    return pathname === `/store/${storeId}${path}` || pathname.startsWith(`/store/${storeId}${path}/`);
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
            {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <span className="font-bold text-xl">Admin Dashboard</span>
        </div>
          {/* <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo.src}
                alt="logo"
                className="h-9 w-12 text-primary transition-transform group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              eCom Admin Dashboard
            </h1>
          </div> */}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isUser && <CreateStoreBtn />}
            {storeId && pages.map((page) => {
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

      {/* Mobile Navigation */}
      {storeId && (
        <nav className="flex border-t md:hidden bg-background overflow-x-auto">
          {pages.slice(0, 5).map((page) => {
            const pagePath = getPagePath(page.path);
            const active = isActive(page.path);
            const Icon = page.icon;

            return (
              <button
                key={page.path}
                onClick={() => router.push(pagePath)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative min-w-[60px]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{page.label}</span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;