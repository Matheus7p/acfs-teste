import { createContext, useContext, useState, useEffect, useCallback, ReactNode, JSX } from "react";

import { dashboardService } from "@/services/dashboard.service";
import { IDashboardData } from "@/types/dashboard-data.type";
import { ISupabaseContextType } from "@/types/supabase-context.type";

const SupabaseContext = createContext<ISupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [uploads, setUploads] = useState<IDashboardData[]>([]);
  const [currentData, setCurrentData] = useState<IDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUploads = useCallback(async () => {
    setIsLoading(true);

    const data = await dashboardService.getAllUploads();
    setUploads(data);
    setIsLoading(false);
  }, []);

  const selectUpload = useCallback((id: string) => {
    const selected = uploads.find((u) => u.id === id);
    if (!selected) return; 
    
    setCurrentData(selected);
  }, [uploads]);

  const addUpload = useCallback((newUpload: IDashboardData) => {
    setUploads((prev) => [newUpload, ...prev]);
    setCurrentData(newUpload);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUploads();
  }, [fetchUploads]);

  return (
    <SupabaseContext.Provider 
      value={{ uploads, currentData, isLoading, fetchUploads, selectUpload, addUpload }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = (): ISupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error("useSupabase must be used inside a SupabaseProvider");
  return context;
};
