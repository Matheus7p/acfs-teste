import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";


import { useSupabase } from "@/context/supabase.context";
import { uploadService } from "@/services/upload.service";

interface IUseFileUploadReturn {
  uploadFile: (file: File) => Promise<undefined>;
  isUploading: boolean;
  errorMessage: string | null;
}

export const useFileUpload = (): IUseFileUploadReturn => {
  const { addUpload } = useSupabase();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const uploadFile = useCallback(
    async (file: File): Promise<undefined> => {
      setIsUploading(true);
      setErrorMessage(null);

      try {
        const response = await uploadService.processFile(file);

        if (response.status !== "success") {
          setErrorMessage(response.message);
          setIsUploading(false); 
          return;
        }
        const { db_id, metadata, data } = response;
          
        addUpload({
          id: db_id,
          filename: file.name,
          metadata,
          rows: data,
          uploaded_at: new Date().toISOString(),
        });
        void navigate(`/dashboard/${db_id}`);
      } catch (error) {
        console.error("Upload error:", error);
        setErrorMessage("Falha ao processar o arquivo. Tente novamente.");
      } finally {
        setIsUploading(false);
      }
    },
    [addUpload, navigate],
  );

  return { uploadFile, isUploading, errorMessage };
};
