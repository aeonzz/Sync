import { Card } from "@/components/ui/card";
import { getUser } from "@/lib/actions/user.actions";
import React from "react";
import FetchDataError from "@/components/ui/fetch-data-error";
import { redirect } from "next/navigation";
import ProfileAvatar from "@/components/ui/profile-avatar";
import ProfileCover from "@/components/ui/profile-cover";
import EditProfile from "@/components/ui/edit-profile";

interface UserProfileProps {
  params: {
    userId: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = async ({ params }) => {
  const currentUser = await getUser(params.userId);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (currentUser.data.onboarded === false) {
    redirect("/onboarding");
  }


  return (
    <div className="h-screen w-full">
      <Card className="relative h-[200px] border-none">
        <ProfileCover currentUser={currentUser.data} />
        <ProfileAvatar currentUser={currentUser.data} />
        <EditProfile currentUser={currentUser.data} />
      </Card>
    </div>
  );
};

export default UserProfile;
