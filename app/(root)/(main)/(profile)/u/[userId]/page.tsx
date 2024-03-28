import { Card } from "@/components/ui/card";
import { getUserById } from "@/lib/actions/user.actions";
import React from "react";
import FetchDataError from "@/components/ui/fetch-data-error";
import { redirect } from "next/navigation";
import ProfileAvatar from "@/components/ui/profile-avatar";
import ProfileCover from "@/components/ui/profile-cover";
import EditProfile from "@/components/ui/edit-profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface UserProfileProps {
  params: {
    userId: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const userData = await getUserById(params.userId);
  if (!userData.data || userData.error) {
    return <FetchDataError />;
  }

  if (userData.data.onboarded === false) {
    redirect("/onboarding");
  }

  return (
    <div className="h-screen w-full">
      <Card className="relative h-[200px] border-none">
        <ProfileCover userData={userData.data} />
        <ProfileAvatar userData={userData.data} />
        {session?.user.id === params.userId && (
          <EditProfile userData={userData.data} />
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
