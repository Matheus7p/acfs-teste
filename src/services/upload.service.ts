import { IUploadResponse } from "@/types/upload.type";

import { api } from "./api.service";

export const uploadService = {
  processFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<IUploadResponse>("/api/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return data;
  },
};
