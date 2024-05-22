import EventDetails from "@/components/screens/event-details";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getEventDates } from "@/lib/actions/event.actions";
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

  const eventDates = await getEventDates();

  if (!eventDates || eventDates.error) {
    return <FetchDataError />;
  }

  return (
    <div className="w-full">
      <EventDetails
        eventId={eventId}
        currentUserId={session.user.id}
        // @ts-ignore
        eventDates={eventDates.data}
      />
    </div>
  );
};

export default page;
