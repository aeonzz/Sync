import { Card } from "@/components/ui/card";
import {
  checkIfCurrentUserFollowedUser,
  getUserById,
} from "@/lib/actions/user.actions";
import React from "react";
import FetchDataError from "@/components/ui/fetch-data-error";
import { redirect } from "next/navigation";
import ProfileAvatar from "@/components/ui/profile-avatar";
import ProfileCover from "@/components/ui/profile-cover";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NotFound from "@/app/not-found";
import ProfileActions from "@/components/ui/edit-profile";

interface UserProfileProps {
  params: {
    userId: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = async ({ params }) => {
  const paramsId = params.userId;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);
  const userData = await getUserById(params.userId);

  if (!userData.data || !paramsId) {
    return <NotFound className="w-full" />;
  }

  if (userData.error || currentUser.error || !currentUser.data) {
    return <FetchDataError />;
  }

  if (!userData.data.onboarded) {
    redirect("/onboarding");
  }

  const isAlreadyFollowed = await checkIfCurrentUserFollowedUser(
    currentUser.data.id,
    paramsId,
  );

  return (
    <div className="h-screen w-full">
      <Card className="relative h-[200px] border-none">
        <ProfileCover userData={userData.data} />
        <ProfileAvatar userData={userData.data} />
        <ProfileActions
          userData={userData.data}
          session={session}
          paramsId={paramsId}
          currentUser={currentUser.data}
          isAlreadyFollowed={isAlreadyFollowed}
        />
      </Card>
    </div>
  );
};

export default UserProfile;
