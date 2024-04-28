import RightSideBar from "@/components/shared/right-sidebar";
import UserNav from "@/components/ui/user-nav";
import React from "react";

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <section className="flex space-x-4">
      <div className="min-h-[400px] w-auto">{children}</div>
      <div className="relative flex-1">
        <div className="sticky top-2 flex h-[calc(100vh-40px)] flex-col space-y-3 overflow-hidden rounded-md">
          <div className="w-full flex justify-end">
            <UserNav />
          </div>
          <div className="flex w-full space-x-4 h-full">
            <RightSideBar />
            <div className="w-16 rounded-md bg-card"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
