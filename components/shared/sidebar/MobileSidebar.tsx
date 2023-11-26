"use client";

import React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import Logo from "../navbar/Logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";

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
              className={`${
                isActive
                  ? "bg-primary-500 text-light-900"
                  : "text-dark300_light900"
              } sidebar-link`}
            >
              <item.icon
                className={`${isActive ? "" : "invert-colors"} h-6 w-6`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </div>
  );
};

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon size={32} className="lg:hidden" />
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
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[48px] w-full px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[48px] w-full border px-4 py-3 shadow-none">
                    <span>Register</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
