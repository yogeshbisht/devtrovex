"use client";

import React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SignedOut, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants";
import Logo from "@/components/shared/navbar/Logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SidebarContent = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <div className="sidebar-wrap pt-20">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") {
          if (!userId) {
            return null;
          }
          item.route = `${item.route}/${userId}`;
        }
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={cn("sidebar-link pl-10", {
                "bg-primary-500 text-light-900": isActive,
              })}
            >
              <item.icon size={20} />
              <p className="text-[18px]">{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </div>
  );
};

const MobileSidebar = () => {
  const router = useRouter();

  const redirectToRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon
          size={32}
          className="active-theme rounded-full border p-1.5 lg:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 w-[256px] border-none"
      >
        <section className="flex h-full flex-col justify-between">
          <div>
            <div className="pl-10 pt-2">
              <Logo isMobile />
            </div>
            <SheetClose asChild>
              <SidebarContent />
            </SheetClose>
          </div>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Button
                  onClick={() => redirectToRoute("/sign-in")}
                  className="btn-secondary h-12"
                >
                  Login
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  onClick={() => redirectToRoute("/sign-up")}
                  className="btn-tertiary h-12"
                >
                  Register
                </Button>
              </SheetClose>
            </div>
          </SignedOut>
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
