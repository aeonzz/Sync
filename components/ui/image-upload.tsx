import { useEffect, useState } from "react";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/forms/multi-image";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn(openImageInput ? "opacity-100" : "h-0 w-0 opacity-0")}>
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
