"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const BackButton = ({ className }: { className?: string | undefined }) => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={cn(className, "px-2")}
    >
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;
