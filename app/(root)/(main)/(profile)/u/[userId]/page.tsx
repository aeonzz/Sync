import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import UserFeed from "@/components/shared/user-feed";
import CreatePost from "@/components/ui/create-post";

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

  if (!userData.data || !currentUser.data || !paramsId) {
    return <NotFound className="w-full" />;
  }

  if (userData.error || currentUser.error) {
    return <FetchDataError />;
  }

  if (!userData.data.onboarded) {
    redirect("/onboarding");
  }

  const isAlreadyFollowed = await checkIfCurrentUserFollowedUser(
    userData.data.id,
    paramsId,
  );

  return (
    <div className="h-auto w-full space-y-32">
      <Card className="relative h-[200px] border-none">
        <ProfileCover userData={userData.data} />
        <ProfileAvatar userData={userData.data} />
        <ProfileActions
          userData={userData.data}
          session={session}
          paramsId={paramsId}
          currentUser={userData.data}
          isAlreadyFollowed={isAlreadyFollowed}
        />
      </Card>
      <div className="flex h-auto w-full space-x-2">
        <div className="w-[550px]">
          {paramsId === session.user.id && (
            <CreatePost currentUser={userData.data} announcement={false} />
          )}
          <UserFeed session={session} userId={userData.data.id} currentUserData={currentUser.data} />
        </div>
        <Card className="flex-1 h-fit">
          <CardHeader>
            <CardTitle>Profile Info.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold">
                {userData.data._count.followers}{" "}
                <span className="text-muted-foreground">Followers</span>
              </h3>
              <h3 className="text-sm font-semibold">
                {userData.data._count.following}{" "}
                <span className="text-muted-foreground">Following</span>
              </h3>
            </div>
            <div className="h-auto w-full space-y-3 text-center">
              <h4 className="text-sm text-muted-foreground">Bio</h4>
              <p className="text-sm font-semibold"> {userData.data.bio}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
