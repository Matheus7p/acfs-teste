export interface IUploadResponse {
  status: "success" | "error";
  db_id: string;
  data: Record<string, string | number | boolean | null>[];
  metadata: Record<string, "numeric" | "temporal" | "categorical" | "empty">;
  message: string;
}
