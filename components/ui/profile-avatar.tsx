import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProps } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ProfileAvatarProps {
  userData: UserProps;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = async ({ userData }) => {
  const profileImage = userData.avatarUrl
    ? userData.avatarUrl
    : undefined;
  const fullname = `${userData.StudentData.firstName} ${userData.StudentData.middleName.charAt(0).toUpperCase()} ${userData.StudentData.lastName}`;
  
  return (
    <div className="absolute -bottom-28 left-5 flex h-32 w-auto items-end space-x-3">
      <Dialog>
        <div className="relative">
          <DialogTrigger asChild>
            <Avatar className="group relative h-36 w-36 cursor-pointer border-4 border-background">
              <div className="absolute z-50 h-full w-full rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
              <AvatarImage
                src={profileImage}
                className="object-cover"
                alt={profileImage}
              />
              <AvatarFallback>
                {userData.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
        </div>
        {profileImage && (
          <DialogImage className="max-h-[80%] !w-fit">
            <Image
              className="object-cover"
              src={profileImage}
              alt="Cover Photo"
              width={500}
              height={500}
              quality={100}
              priority
            />
          </DialogImage>
        )}
      </Dialog>
      <div className="mb-5">
        <h2 className="inline-flex items-center gap-3 text-4xl font-semibold">
          {userData.username}
        </h2>
        <h4 className="text-muted-foreground">{fullname}</h4>
        <h4 className="text-muted-foreground">
          {userData.StudentData.department}
        </h4>
      </div>
    </div>
  );
};

export default ProfileAvatar;
