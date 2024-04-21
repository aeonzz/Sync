"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster as Sonner } from "sonner";

const inter = Inter({ subsets: ["latin"] });

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: cn(
            inter.className,
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:shadow-lg !border-stone-900",
          ),
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
