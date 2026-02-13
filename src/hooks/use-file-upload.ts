import axios from "axios";
import { useState, useCallback } from "react";

import { useSupabase } from "@/context/supabase.context";
import { env } from "@/env.mjs";

interface IUploadResponse {
  status: "success" | "error";
  db_id: string;
  data: Record<string, string | number | boolean | null>[];
  metadata: Record<string, "numeric" | "temporal" | "categorical" | "empty">;
  message: string;
}

interface IUseFileUploadReturn {
  uploadFile: (file: File) => Promise<undefined>;
  isUploading: boolean;
  errorMessage: string | null;
}

export const useFileUpload = (): IUseFileUploadReturn => {
  const { addUpload } = useSupabase();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<undefined> => {
      setIsUploading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post<IUploadResponse>(
          `${env.VITE_API_URL}/api/process`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data.status === "success") {
          addUpload({
            id: response.data.db_id,
            filename: file.name,
            metadata: response.data.metadata,
            rows: response.data.data,
            uploaded_at: new Date().toISOString(),
          });
        } else {
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setErrorMessage("Falha ao processar o arquivo. Tente novamente.");
      } finally {
        setIsUploading(false);
      }
      
      return undefined;
    },
    [addUpload],
  );

  return { 
    uploadFile, 
    isUploading, 
    errorMessage, 
  };
};
