"use client";

import { useState } from "react";
import { SingleImageDropzone } from "./single-image";
import { Button } from "../ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { createBanner } from "@/lib/actions/banner.actions";
import Loader from "../loaders/loader";
import { useRouter } from "next/navigation";

const BannerUploadForm = () => {
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const router = useRouter()

  async function onSubmit() {
    setIsLoading(true)
    let res;
    if (file) {
      try {
        res = await edgestore.publicImages.upload({
          file: file,
        });
      } catch (error) {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    if (!res) return null;

    const result = await createBanner(res.url);

    if (result.status === 200) {
      setIsLoading(false);
      toast("Profile successfully updated");
      router.refresh()
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div>
      <SingleImageDropzone
        width={256}
        height={130}
        removeIcon={false}
        className="rounded-md bg-secondary"
        value={file}
        disabled={isLoading}
        onChange={(file) => {
          setFile(file);
        }}
      />
      <Button
        className="flex-1"
        size="sm"
        onClick={onSubmit}
        disabled={isLoading || !file}
      >
        {isLoading && <Loader />}
        {isLoading ? null : <p>Upload</p>}
      </Button>
    </div>
  );
};

export default BannerUploadForm;
