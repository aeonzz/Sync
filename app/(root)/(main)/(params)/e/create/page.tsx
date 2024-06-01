import NotFound from "@/app/not-found";
import CreateEventPage from "@/components/screens/create-event-page";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { UserRoleType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }

  if (currentUser.data.role === UserRoleType.USER) {
    notFound();
  }

  return (
    <div className="h-screen w-full">
      <CreateEventPage currentUserId={session.user.id} />
    </div>
  );
};

export default page;
