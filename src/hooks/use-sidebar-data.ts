import { useCallback } from "react";

import { useSupabase, type IDashboardData } from "@/context/supabase.context";

interface IUseSidebarReturn {
  uploads: IDashboardData[];
  isLoading: boolean;
  selectedId: string | undefined;
  handleSelect: (id: string) => undefined;
}

export const useSidebarData = (): IUseSidebarReturn => {
  const { uploads, isLoading, currentData, selectUpload } = useSupabase();

  const handleSelect = useCallback((id: string): undefined => {
    selectUpload(id);
    return undefined;
  }, [selectUpload]);

  return {
    uploads,
    isLoading,
    selectedId: currentData?.id,
    handleSelect,
  };
};
