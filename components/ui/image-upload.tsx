import { useState } from "react";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/forms/multi-image";
import { useEdgeStore } from "@/lib/edgestore";

interface ImageUploadProps {
  onUrlsChange: (urls: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUrlsChange }) => {
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

  return (
    <MultiImageDropzone
      value={fileStates}
      dropzoneOptions={{
        maxFiles: 6,
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
              onUrlsChange([...urls, res.url]);
            } catch (err) {
              updateFileProgress(addedFileState.key, "ERROR");
            }
          }),
        );
      }}
    />
  );
};

export default ImageUpload;
