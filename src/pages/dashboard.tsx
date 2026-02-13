import { JSX, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Sidebar } from "@/components/sidebar.component";
import { BarChartCard } from "@/components/ui/bar-char-card.ui";
import { PieChartCard } from "@/components/ui/pie-chart-card.ui";
import { StatCard } from "@/components/ui/stat-card.ui";
import { useSupabase } from "@/context/supabase.context";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { aggregateByMonthColumn, aggregateDataByKey } from "@/utils/chart-data.utils";
import { formatBRL } from "@/utils/formatBRL.utils";


export const DashboardPage = (): JSX.Element => {
  const { fileId } = useParams<{ fileId: string }>();
  const { currentData, uploads, selectUpload } = useSupabase();

  useEffect(() => {
    if (fileId && uploads.length > 0) selectUpload(fileId);
  }, [fileId, uploads, selectUpload]);
  
  const { totalRevenue, orderCount, averageTicket, valueKey, categoryKey } = useDashboardMetrics(
    currentData?.rows || [], 
    currentData?.metadata || {},
  );

  const rows = currentData?.rows;

  const chartData = useMemo(() => {
    if (!rows || !categoryKey || !valueKey) return [];
  
    return aggregateDataByKey(rows, categoryKey, valueKey);
  
  }, [rows, categoryKey, valueKey]);

  const barData = useMemo(() => {
    if (!rows || !valueKey) return [];
  
    return aggregateByMonthColumn(rows, valueKey);
  
  }, [rows, valueKey]);

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
            value={formatBRL(totalRevenue)} 
            colorClass="text-green-600" 
          />
          <StatCard 
            title="Pedidos" 
            value={orderCount.toLocaleString("pt-BR")} 
          />
          <StatCard 
            title="Ticket Médio" 
            value={formatBRL(averageTicket)} 
            colorClass="text-blue-600" 
          />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto mb-8">
  
          <div className="h-114 flex flex-col">
            {chartData.length > 0 && (
              <PieChartCard 
                title={`Distribuição por ${categoryKey}`} 
                data={chartData} 
              />
            )}
          </div>

          <div className="h-114 flex flex-col">
            {barData.length > 0 && (
              <BarChartCard 
                title="Faturamento Mensal" 
                data={barData} 
              />
            )}
          </div>

        </section>
      </main>
    </div>
  );
};
