import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { NavigationMenuDemo } from "./Nav-menu";
import { cn } from "@/lib/utils";

const LandingPageNav = () => {
  return (
    <nav className="border-b">
      <div className="mx-auto flex w-screen max-w-[1600px] items-center justify-between px-14 py-3">
        <div className="flex items-center space-x-5">
          <h1>LOGO</h1>
          <NavigationMenuDemo />
        </div>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "default" }), "text-sm")}
        >
          Open Sync
        </Link>
      </div>
    </nav>
  );
};

export default LandingPageNav;
