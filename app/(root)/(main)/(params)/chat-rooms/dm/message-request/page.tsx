import MessageRequest from "@/components/screens/message-request";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);

  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  return (
    <div className="flex h-screen flex-col pb-3">
      <div className="flex h-[75px] w-full items-center border-b p-4">
        <p className="scroll-m-20 text-sm font-semibold tracking-tight">
          Message Request
        </p>
      </div>
      <MessageRequest currentUserId={currentUser.data.id} />
    </div>
  );
};

export default Page;
