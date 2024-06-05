import AdminMenu from "@/components/shared/admin-menu";
import RightSideBar from "@/components/shared/right-sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth");
  }

  return (
    <section className="w-full h-screen flex">
      <AdminMenu currentUserId={session.user.id} />
      {children}
    </section>
  );
}
