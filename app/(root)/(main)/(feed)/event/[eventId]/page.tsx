import EventDetails from "@/components/screens/event-details";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { eventId: string } }) => {
  const { eventId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen w-[550px]">
      <EventDetails eventId={eventId} />
    </div>
  );
};

export default page;
