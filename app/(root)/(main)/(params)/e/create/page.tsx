import CreateEventPage from '@/components/screens/create-event-page';
import FetchDataError from '@/components/ui/fetch-data-error';
import { getUserById } from '@/lib/actions/user.actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

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

  return (
    <div className="h-screen w-full">
      <CreateEventPage currentUserId={session.user.id} />
    </div>
  )
}

export default page