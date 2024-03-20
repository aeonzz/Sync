import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { CurrentUser } from "@/types/user";
import { getPlaiceholder } from "plaiceholder";

interface ProfileCoverProps {
  currentUser: CurrentUser;
}

const ProfileCover: React.FC<ProfileCoverProps> = async ({ currentUser }) => {
  const profileCover = currentUser.coverUrl
    ? currentUser.coverUrl
    : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/nat-cXuvDkzEJdE-unsplash.jpg";

  const buffer = await fetch(profileCover).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { base64 } = await getPlaiceholder(buffer);

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
            priority
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
          />
        </DialogImage>
      </Dialog>
    </>
  );
};

export default ProfileCover;
