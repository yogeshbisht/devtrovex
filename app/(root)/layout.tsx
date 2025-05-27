import React, { Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex justify-center">Loading...</div>}>
      <main className="background-light850_dark100 relative flex">
        <LeftSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          <div className="flex flex-1 justify-between pt-24">
            <section className="flex-1 p-6 pt-10 max-md:pb-14 sm:px-14">
              {children}
            </section>
            <RightSidebar />
          </div>
        </div>
        <Toaster />
      </main>
    </Suspense>
  );
};

export default RootLayout;
