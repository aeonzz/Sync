import QueryClientProvder from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
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
