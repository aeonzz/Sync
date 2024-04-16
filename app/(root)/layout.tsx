import QueryClientProvder from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={cn(inter.className, "bg-background")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <QueryClientProvder>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
            <Toaster richColors />
          </QueryClientProvder>
        </SessionProvider>
      </ThemeProvider>
    </section>
  );
}
