"use client";

import { useRouter, usePathname } from "next/navigation";
import { Store, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStoreModel } from "@/Hooks/Use_store_model";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface HeaderProps {
  stores: Array<{
    id: string;
    name: string;
    createdAt: Date;
  }> | null;
  userId: string | null;
}

const Header = ({ stores, userId }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpen } = useStoreModel();

  // Extract current store ID from pathname
  const currentStoreId = pathname.split("/")[2];

  const handleStoreChange = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <span className="font-bold text-xl">Admin Dashboard</span>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-4">
          {userId && stores && stores.length > 0 ? (
            <div className="flex items-center gap-2">
              <Select value={currentStoreId} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={onOpen}
                title="Create new store"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            userId && (
              <Button onClick={onOpen} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Store
              </Button>
            )
          )}
          <ModeToggle />
          {!userId && (
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton>
                  <Button variant={"outline"}>Sign In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant={"default"}>Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          )}
          {/* User Button */}

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default Header;
