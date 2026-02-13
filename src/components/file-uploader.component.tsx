import { AlertCircle } from "lucide-react";
import { JSX } from "react";

import { useFileUpload } from "@/hooks/use-file-upload";

import { DropzoneField } from "./ui/dropzone-field.ui";


export const FileUploader = (): JSX.Element => {
  const { uploadFile, isUploading, errorMessage } = useFileUpload();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <DropzoneField onFileSelect={uploadFile} disabled={isUploading} />
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
