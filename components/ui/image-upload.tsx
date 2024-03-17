import { useEffect, useRef, useState } from "react";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/forms/multi-image";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ImageUploadProps {
  onUrlsChange: (urls: string[]) => void;
  onFileStatesChange: (state: FileState[]) => void;
  openImageInput: boolean;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUrlsChange,
  onFileStatesChange,
  openImageInput,
  isLoading,
}) => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const { edgestore } = useEdgeStore();
  const animationTimelineRef = useRef<gsap.core.Timeline>(null);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  useEffect(() => {
    onFileStatesChange(fileStates);
    onUrlsChange(urls);
  }, [fileStates, onFileStatesChange, urls]);

  useEffect(() => {
    animationTimelineRef.current?.clear();
  }, []);

  useGSAP(() => {
    //@ts-ignore
    animationTimelineRef.current = gsap.timeline();
    if (openImageInput) {
      animationTimelineRef.current.to("#imageInputAnimation", {
        height: 150,
        opacity: 1,
        duration: 0.2,
        scaleY: 1,
      });
    } else {
      animationTimelineRef.current.to("#imageInputAnimation", {
        height: 0,
        opacity: 0,
        duration: 0.2,
        scaleY: 0,
      });
    }
  }, [openImageInput]);

  return (
    <div id="imageInputAnimation" className="h-0 scale-y-0 opacity-0">
      <MultiImageDropzone
        disabled={isLoading}
        value={fileStates}
        dropzoneOptions={{
          maxFiles: 20,
        }}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicImages.upload({
                  // @ts-ignore
                  file: addedFileState.file,
                  options: {
                    temporary: true,
                  },
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                setUrls((prevUrls) => [...prevUrls, res.url]);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            }),
          );
        }}
      />
    </div>
  );
};

export default ImageUpload;
