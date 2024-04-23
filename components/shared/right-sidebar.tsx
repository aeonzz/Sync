import { getServerSession } from "next-auth";
import PopularUsers from "./popular-users";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const RightSideBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="w-full">
      <PopularUsers currentUserId={session.user.id} />
    </div>
  );
};

export default RightSideBar;
