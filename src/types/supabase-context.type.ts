import { IDashboardData } from "./dashboard-data.type";

export interface ISupabaseContextType {
  uploads: IDashboardData[];
  currentData: IDashboardData | null;
  isLoading: boolean;
  fetchUploads: () => Promise<void>;
  selectUpload: (id: string) => void;
  addUpload: (newUpload: IDashboardData) => void;
}
