import { supabase } from "@/lib/supabase";
import { IDashboardData } from "@/types/dashboard-data.type";

export const dashboardService = {
  async getAllUploads () {
    const { data, error } = await supabase
      .from("dashboard_uploads")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    
    return (data as IDashboardData[]) || [];
  },
};
