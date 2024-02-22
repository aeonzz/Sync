import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { NavMenu } from "./nav-menu";

const LandingPageNav = () => {
  return (
    <nav className="border-b">
      <div className="mx-auto flex w-screen max-w-[1600px] items-center justify-between px-14 py-3">
        <div className="flex items-center space-x-5">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Sync
          </h2>
          <NavMenu />
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
