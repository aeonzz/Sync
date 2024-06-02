import React from "react";
import LeftSideBar from "@/components/shared/left-sidebar";
import NextTopLoader from "nextjs-toploader";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container relative flex h-auto justify-between px-0">
      <NextTopLoader color="#434eea" showSpinner={false} height={2} />
      <LeftSideBar />
      <div className="flex-1">{children}</div>
    </main>
  );
}
