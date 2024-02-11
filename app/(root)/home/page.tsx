import Logout from "@/components/ui/logout";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <ThemeToggle />
      <Logout />
    </div>
  );
}
