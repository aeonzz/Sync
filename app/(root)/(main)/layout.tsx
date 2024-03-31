import React from "react";
import LeftSideBar from "@/components/shared/left-sidebar";


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container relative flex h-auto justify-between px-0">
      <LeftSideBar />
      <div className="flex-1 pr-4">{children}</div>
    </main>
  );
}
