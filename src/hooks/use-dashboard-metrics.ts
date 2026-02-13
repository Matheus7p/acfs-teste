import { useMemo } from "react";

import { IDashboardRow } from "@/types/dashboard-row.type";

export const processDashboardValue = (raw: unknown): number => {
  const val = Number(raw);
  if (isNaN(val)) return 0;
  const isNeedsCorrection = val > 100000 && Number.isInteger(val);
  return isNeedsCorrection ? val / 100 : val;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDashboardMetrics = (rows: IDashboardRow[], metadata: Record<string, string>) => {
  return useMemo(() => {
    if (!rows || rows.length === 0 || !metadata) {
      return { totalRevenue: 0, orderCount: 0, averageTicket: 0, valueKey: "", categoryKey: "" };
    }

    const keys = Object.keys(metadata);
    const numericKeys = keys.filter(key => metadata[key] === "numeric");

    const valueKey = numericKeys.find(key => {
      const k = key.toLowerCase();
      return k.includes("receita") || k.includes("valor") || k.includes("preco") || k.includes("price") || k.includes("total");
    }) || numericKeys[0];

    const categoryKey = keys.find(key => key.toLowerCase().includes("categoria")) || 
                        keys.find(key => metadata[key] === "categorical" && !key.toLowerCase().includes("data")) || 
                        "Categoria";

    const totalRevenue = rows.reduce((acc, row) => {
      const val = row[valueKey as keyof IDashboardRow];
      return acc + processDashboardValue(val);
    }, 0);

    const orderCount = rows.length;
    const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

    return { totalRevenue, orderCount, averageTicket, valueKey, categoryKey };
  }, [rows, metadata]);
};
