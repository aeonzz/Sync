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
      <TopBar />
      <div className="flex space-x-4">
        {children}
        <div className="w-16 rounded-md bg-card"></div>
      </div>
    </section>
  );
}
