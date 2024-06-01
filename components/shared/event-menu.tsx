"use client"

import React from "react";
import BackButton from "../ui/back-button";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface EventMenuProps {
  eventId: string;
}

const EventMenu: React.FC<EventMenuProps> = ({ eventId }) => {

  const pathname = usePathname()

  return (
    <nav className="flex h-[54px] items-center space-x-5">
      <div className="flex items-center space-x-1">
        <BackButton />
        <h2 className="text-md scroll-m-20 font-semibold tracking-tight first:mt-0">
          Event
        </h2>
      </div>
      <ul className="flex items-center">
        <li>
          <Link
            href={`/e/${eventId}/overview`}
            className={cn(
              buttonVariants({ variant: "tab"}),
              pathname === `/e/${eventId}/overview` ? "border-b border-b-primary text-foreground" : "text-muted-foreground",
              "w-20",
            )}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            href={`/e/${eventId}/guest`}
            className={cn(
              buttonVariants({ variant: "tab"}),
              pathname === `/e/${eventId}/guest` ? "border-b border-b-primary text-foreground" : "text-muted-foreground",
              "w-20",
            )}
          >
            Guests
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default EventMenu;
