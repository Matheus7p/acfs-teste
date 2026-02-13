import { useMemo } from "react";

import { IDashboardRow } from "@/types/dashboard-row.type";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDashboardMetrics = (rows: IDashboardRow[], metadata: Record<string, string>) => {
  return useMemo(() => {
    if (!rows || rows.length === 0 || !metadata) {
      return { totalRevenue: 0, orderCount: 0, averageTicket: 0, valueKey: "" };
    }

    const numericKeys = Object.keys(metadata).filter(key => metadata[key] === "numeric");
    const validMetricsKeys = numericKeys.filter(key => {
      const k = key.toLowerCase();
      return !k.includes("id") && !k.includes("cod") && !k.includes("cpf") && !k.includes("zip");
    });

    const valueKey = validMetricsKeys.find(key => {
      const k = key.toLowerCase();
      return k.includes("receita") || k.includes("valor") || k.includes("preco") || k.includes("price") || k.includes("total");
    }) || validMetricsKeys[0] || numericKeys[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processValue = (raw: any): number => {
      const val = Number(raw);
      if (isNaN(val)) return 0;
      const isNeedsCorrection = val > 100000 && Number.isInteger(val); 
      return isNeedsCorrection ? val / 100 : val;
    };

    const totalRevenue = rows.reduce((acc, row) => acc + processValue(row[valueKey]), 0);
    const orderCount = rows.length;
    const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

    return { totalRevenue, orderCount, averageTicket, valueKey, processValue };
  }, [rows, metadata]);
};
