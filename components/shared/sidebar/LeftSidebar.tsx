"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { UserCircle2, UserPlus2 } from "lucide-react";

import Logo from "@/components/shared/navbar/Logo";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const redirectToRoute = (route: string) => {
    router.push(route);
  };

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen w-[80px] flex-col justify-between overflow-y-auto border-r py-6 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[256px]">
      <div>
        <div className="pl-6 pt-2 lg:pl-10">
          <Logo />
        </div>
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
              <Link
                key={item.route}
                href={item.route}
                className={cn("sidebar-link justify-center", {
                  "bg-primary-500 text-light-900": isActive,
                })}
              >
                <item.icon size={20} />
                <p className="text-[18px] max-lg:hidden">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => redirectToRoute("/sign-in")}
            className="btn-secondary h-12"
          >
            <UserCircle2 size={20} className="lg:hidden" />
            <span className="max-lg:hidden">Log In</span>
          </Button>
          <Button
            onClick={() => redirectToRoute("/sign-up")}
            className="btn-tertiary h-12"
          >
            <UserPlus2 size={20} className="lg:hidden" />
            <span className="max-lg:hidden">Register</span>
          </Button>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
