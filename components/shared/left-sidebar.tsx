import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SideBarNav from "./sidebar-nav";
import UserNav from "../ui/user-nav";

const LeftSideBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  return (
    <aside className="sticky left-0 top-0 flex h-screen w-[270px] flex-col items-center justify-between space-y-7 p-5">
      <SideBarNav currentUserId={session.user.id} />
      <UserNav />
    </aside>
  );
};

export default LeftSideBar;
