import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { UserProps } from "@/types/user";
import { getPlaiceholder } from "plaiceholder";
import getBase64 from "@/lib/base64";

interface ProfileCoverProps {
  userData: UserProps;
}

const ProfileCover: React.FC<ProfileCoverProps> = async ({ userData }) => {
  const profileCover = userData.coverUrl

  const base64 = await getBase64(profileCover)
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Image
            fill
            className="cursor-pointer rounded-lg object-cover object-center"
            src={profileCover}
            alt="cover photo"
            quality={100}
            placeholder="blur"
            blurDataURL={base64}
          />
        </DialogTrigger>
        <DialogImage className="h-[75%] max-w-5xl">
          <Image
            className="object-cover"
            src={profileCover}
            alt="Cover Photo"
            fill
            quality={100}
            placeholder="blur"
            blurDataURL={base64}
          />
        </DialogImage>
      </Dialog>
    </>
  );
};

export default ProfileCover;
