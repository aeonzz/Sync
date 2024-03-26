import { getBanner } from "@/lib/actions/banner.actions";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

const Haha = async () => {
  const banners = await getBanner();
  

  return (
    <Card className="flex h-1/2 items-center justify-center">
      {/* {banners.data?.map((image) => (
        <Image src={image} alt="asd" width={100} height={100} blurDataURL={image} />
      ))} */}
      {/* {base64Images.map((image) => (
        <Image src={image} alt="asd" width={100} height={100} blurDataURL={image} />
      ))} */}
    </Card>
  );
};

export default Haha;
