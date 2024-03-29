import ProfileNav from "@/components/shared/profile-nav";
import TopBar from "@/components/shared/top-bar";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sync",
  description: "Generated by create next app",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex space-x-3 pt-5">
      {children}
    </section>
  );
}
