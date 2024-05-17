import RightSideBar from "@/components/shared/right-sidebar";
import UserNav from "@/components/ui/user-nav";
import React from "react";

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex space-x-4 pl-4 pr-2">
      <div className="min-h-[400px] w-auto">{children}</div>
      <div className="relative flex-1">
        <div className="sticky top-2 flex h-[calc(100vh-40px)] flex-col space-y-3 overflow-hidden rounded-md">
          <div className="flex w-full justify-end">
            <UserNav />
          </div>
          <div className="flex h-full w-full space-x-4">
            <RightSideBar />
          </div>
        </div>
      </div>
    </section>
  );
}
