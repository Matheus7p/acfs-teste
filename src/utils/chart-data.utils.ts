/* eslint-disable @typescript-eslint/no-explicit-any */
import { processDashboardValue } from "@/hooks/use-dashboard-metrics";
import { IDashboardRow } from "@/types/dashboard-row.type";

interface IAggregateResult {
  name: string;
  value: number;
}

export const aggregateDataByKey = (
  rows: IDashboardRow[], 
  targetKey: string, 
  valueKey: string,
): IAggregateResult[] => {
  if (!rows || !targetKey || !valueKey) return [];

  const aggregation = rows.reduce((acc: any, row: any) => {
    const groupName = String(row[targetKey] ?? "Outros");
    
    const finalValue = processDashboardValue(row[valueKey]);

    acc[groupName] = (Number(acc[groupName]) || 0) + finalValue;
    
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(aggregation).map(([name, value]): IAggregateResult => ({
    name,

    value: Number((value as number).toFixed(2)),
  }));
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const aggregateByMonthColumn = (rows: IDashboardRow[], valueKey: string) => {
  if (!rows.length || !valueKey) return [];

  const monthlyData = rows.reduce((acc: any, row: any) => {
    const mesKey = Object.keys(row).find(k => k.toUpperCase() === "MES") || "Mes";
    const monthName = String(row[mesKey] || "Outros").toUpperCase().trim();
    
    const val = processDashboardValue(row[valueKey]);
    acc[monthName] = (acc[monthName] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const monthOrder = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return Object.entries(monthlyData)
    .map(([name, value]) => ({ 
      name, 
      value: Number((value as number).toFixed(2)), 
    }))
    .sort((a, b) => {
      const indexA = monthOrder.indexOf(a.name);
      const indexB = monthOrder.indexOf(b.name);
      
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
};
