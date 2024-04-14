import RightSideBar from "@/components/shared/right-sidebar";
import TopBar from "@/components/shared/top-bar";
import React from "react";

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="flex space-x-4">
        <div className="min-h-[400px] w-[550px]">{children}</div>
        <div className="relative flex-1">
          <div className="sticky top-5 h-[calc(100vh-110px)] w-full overflow-hidden rounded-md">
            <RightSideBar />
          </div>
        </div>
        <div className="w-16 rounded-md bg-card"></div>
      </div>
    </section>
  );
}
