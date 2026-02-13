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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
