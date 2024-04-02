"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BackButton = ({ className }: { className?: string | undefined }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              pathname.startsWith("/auth/reset-password")
                ? router.push("/auth")
                : router.back();
            }}
            className={cn(className, "px-2")}
          >
            <ChevronLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BackButton;
