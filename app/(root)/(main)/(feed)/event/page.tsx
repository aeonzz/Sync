import PostCard from "@/components/cards/post-card";
import EventPage from "@/components/screens/event-page";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { PostProps } from "@/types/post";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Event = async () => {
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
  return (
    <div className="w-[550px] min-h-screen">
      <EventPage />
    </div>
  );
};

export default Event;
