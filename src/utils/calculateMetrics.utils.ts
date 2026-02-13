import { IDashboardRow } from "@/types/dashboard-row.type";

interface ICalculateDashboard {
  totalRevenue: number;
  orderCount: number;
  averageTicket: number;
}

export const calculateDashboardStats = (rows: IDashboardRow[], metadata: Record<string, string>): ICalculateDashboard => {
  if (!rows || rows.length === 0) {
    return { totalRevenue: 0, orderCount: 0, averageTicket: 0 };
  }

  const numericKeys = Object.keys(metadata).filter(key => metadata[key] === "numeric");

  const validMetricsKeys = numericKeys.filter(key => {
    const k = key.toLowerCase();
    return !k.includes("id") && !k.includes("cod") && !k.includes("cpf") && !k.includes("zip");
  });

  const probablePriceKey = validMetricsKeys.find(key => {
    const k = key.toLowerCase();
    return k.includes("receita") || k.includes("valor") || k.includes("preco") || k.includes("price") || k.includes("total");
  }) || validMetricsKeys[0] || numericKeys[0];

  const totalRevenue = rows.reduce((acc, row) => {
    const val = Number(row[probablePriceKey]);
    if (isNaN(val)) return acc;

    const isNeedsCorrection = val > 100000 && Number.isInteger(val); 
    const finalValue = isNeedsCorrection ? val / 100 : val;

    return acc + finalValue;
  }, 0);

  const orderCount = rows.length;
  const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

  return { totalRevenue, orderCount, averageTicket };
};
