import React from "react";
import Theme from "./Theme";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import MobileSidebar from "../sidebar/MobileSidebar";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="background-light900_dark200 fixed inset-x-0 top-0 z-50 flex h-24 items-center justify-between gap-5 p-6 shadow-light-300 dark:shadow-none sm:left-[80px] sm:justify-end sm:px-12 md:justify-between lg:left-[256px]">
      <div className="sm:hidden">
        <Logo isNavbar />
      </div>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
              variables: {
                colorPrimary: "#008fff",
              },
            }}
          />
        </SignedIn>
        <MobileSidebar />
      </div>
    </nav>
  );
};

export default Navbar;
