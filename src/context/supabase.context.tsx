import { createClient } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, JSX } from "react";

import { env } from "@/env.mjs";

interface IColumnMetadata {
  [key: string]: "numeric" | "temporal" | "categorical" | "empty";
}

interface IDashboardRow {
  [key: string]: string | number | boolean | null;
}

export interface IDashboardData {
  id: string;
  filename: string;
  metadata: IColumnMetadata;
  rows: IDashboardRow[];
  uploaded_at: string;
}

interface ISupabaseContextType {
  uploads: IDashboardData[];
  currentData: IDashboardData | null;
  isLoading: boolean;
  fetchUploads: () => Promise<void>;
  selectUpload: (id: string) => void;
  addUpload: (newUpload: IDashboardData) => void;
}

const SupabaseContext = createContext<ISupabaseContextType | undefined>(undefined);

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_KEY,
);

interface IProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: IProviderProps): JSX.Element => {
  const [uploads, setUploads] = useState<IDashboardData[]>([]);
  const [currentData, setCurrentData] = useState<IDashboardData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchUploads = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dashboard_uploads")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setUploads(data as IDashboardData[]);
      }
    } catch (err) {
      console.error("Erro ao buscar uploads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectUpload = (id: string): void => {
    const selected = uploads.find((u) => u.id === id);
    if (selected) {
      setCurrentData(selected);
    }
  };

  const addUpload = (newUpload: IDashboardData): void => {
    setUploads((prev) => [newUpload, ...prev]);
    setCurrentData(newUpload);
  };

  useEffect(() => {
    void fetchUploads();
  }, [fetchUploads]);

  return (
    <SupabaseContext.Provider 
      value={{ 
        uploads, 
        currentData, 
        isLoading, 
        fetchUploads, 
        selectUpload, 
        addUpload, 
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = (): ISupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used inside a SupabaseProvider");
  }
  return context;
};
