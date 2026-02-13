import { JSX, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Sidebar } from "@/components/sidebar.component";
import { StatCard } from "@/components/ui/stat-card.ui";
import { useSupabase } from "@/context/supabase.context";
import { calculateDashboardStats } from "@/utils/calculateMetrics.utils";
import { formatBRL } from "@/utils/formatBRL.utils";

export const DashboardPage = (): JSX.Element => {
  const { fileId } = useParams<{ fileId: string }>();
  const { currentData, uploads, selectUpload } = useSupabase();

  useEffect(() => {
    if (fileId && uploads.length > 0) selectUpload(fileId);
  }, [fileId, uploads, selectUpload]);

  const stats = calculateDashboardStats(currentData?.rows || [], currentData?.metadata || {});

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="font-extrabold md:text-3xl text-slate-500 tracking-tight mt-4 truncate text-center">
            Análise: <span className="text-slate-500">{currentData?.filename || "Carregando..."}</span>
          </h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mb-12">
          <StatCard 
            title="Receita Total" 
            value={formatBRL(stats.totalRevenue)} 
            colorClass="text-green-600" 
          />
          <StatCard 
            title="Pedidos" 
            value={stats.orderCount.toLocaleString("pt-BR")} 
          />
          <StatCard 
            title="Ticket Médio" 
            value={formatBRL(stats.averageTicket)} 
            colorClass="text-blue-600" 
          />
        </section>

      </main>
    </div>
  );
};
