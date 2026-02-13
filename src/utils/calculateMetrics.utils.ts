import { IDashboardRow } from "@/types/dashboard-row.type";

interface ICalculateDashboard {
  totalRevenue : number,
  orderCount : number,
  averageTicket : number
}

export const calculateDashboardStats = (rows: IDashboardRow[], metadata: Record<string, string>): ICalculateDashboard => {
  if (!rows.length || !metadata) {
    return { totalRevenue: 0, orderCount: 0, averageTicket: 0 };
  }

  const numericKeys = Object.keys(metadata).filter(key => metadata[key] === "numeric");
  
  const probablePriceKey = numericKeys.find(key => 
    key.toLowerCase().includes("valor") || 
    key.toLowerCase().includes("preco") || 
    key.toLowerCase().includes("price") ||
    key.toLowerCase().includes("total") ||
    key.toLowerCase().includes("receita"),
  ) || numericKeys[0];

  const totalRevenue = rows.reduce((acc, row) => acc + (Number(row[probablePriceKey]) || 0), 0);
  const orderCount = rows.length;
  const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

  return { totalRevenue, orderCount, averageTicket };
};
