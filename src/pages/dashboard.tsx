/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { FilterBar } from "@/components/filter-bar.component";
import { ProductTable } from "@/components/product-table.component";
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
  const [ filters, setFilters ] = useState({ categoria: "all", mes: "all" });

  useEffect(() => {
    if (fileId && uploads.length > 0) selectUpload(fileId);
  }, [fileId, uploads, selectUpload]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = currentData?.rows || [];
  const metadata = currentData?.metadata || {};
  
  const { totalRevenue, orderCount, averageTicket, valueKey, categoryKey } = useDashboardMetrics(
    rows, 
    metadata,
  );

  const chartData = useMemo(() => {
    if (!rows.length || !categoryKey || !valueKey) return [];
    return aggregateDataByKey(rows, categoryKey, valueKey);
  }, [rows, categoryKey, valueKey]);

  const barData = useMemo(() => {
    if (!rows.length || !valueKey) return [];
    return aggregateByMonthColumn(rows, valueKey);
  }, [rows, valueKey]);

  const categories = useMemo(() => {
    if (!rows.length) return [];
    const values = rows.map((r: any) => String(r[categoryKey] || ""));
    return Array.from(new Set(values)).filter(v => v !== "" && v !== "undefined");
  }, [rows, categoryKey]);

  const months = useMemo(() => {
    if (!rows.length) return [];
    const mesKey = Object.keys(rows[0] || {}).find(k => k === "MES") || "Mes";
    const values = rows.map((r: any) => String(r[mesKey] || ""));
    return Array.from(new Set(values)).filter(v => v !== "" && v !== "undefined");
  }, [rows]);

  const handleClearFilters = (): void => {
    setFilters({ categoria: "all", mes: "all" });
  };

  const filteredRows = useMemo(() => {
    if (!rows.length) return [];
  
    if (filters.categoria === "all" && filters.mes === "all") return rows;

    return rows.filter((row: any) => {
      const isMatchesCat = 
      filters.categoria === "all" || 
      String(row[categoryKey]) === filters.categoria;
    
      const mesKey = Object.keys(row).find(k => k.toUpperCase() === "MES") || "Mes";
      const isMatchesMes = 
      filters.mes === "all" || 
      String(row[mesKey]) === filters.mes;

      return isMatchesCat && isMatchesMes;
    });
  }, [rows, filters, categoryKey]);

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
          <StatCard title="Receita Total" value={formatBRL(totalRevenue)} colorClass="text-green-600" />
          <StatCard title="Pedidos" value={orderCount.toLocaleString("pt-BR")} />
          <StatCard title="Ticket Médio" value={formatBRL(averageTicket)} colorClass="text-blue-600" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto mb-12">
          <div className="min-h-100 flex flex-col">
            {chartData.length > 0 && <PieChartCard title={`Distribuição por ${categoryKey}`} data={chartData} />}
          </div>
          <div className="min-h-100 flex flex-col">
            {barData.length > 0 && <BarChartCard title="Faturamento Mensal" data={barData} />}
          </div>
        </section>

        <div className="w-full max-w-6xl mx-auto">
          <header className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Detalhes dos Produtos</h2>
            <p className="text-slate-500 text-sm">Use os filtros abaixo para refinar a lista de produtos.</p>
          </header>

          <FilterBar 
            categories={categories} 
            months={months} 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters} 
          />

          <ProductTable 
            data={filteredRows} 
            valueKey={valueKey} 
            categoryKey={categoryKey} 
          />
        </div>
      </main>
    </div>
  );
};
