import { IDashboardRow } from "@/types/dashboard-row.type";
import { calculateDashboardStats } from "@/utils/calculateMetrics.utils";


describe("calculateDashboardStats", () => {
  
  it("should return zeros when rows or metadata are empty (Arrange, Act, Assert)", () => {
    // Arrange
    const rows: IDashboardRow[] = [];
    const metadata = {};

    // Act
    const result = calculateDashboardStats(rows, metadata);

    // Assert
    expect(result).toEqual({
      totalRevenue: 0,
      orderCount: 0,
      averageTicket: 0,
    });
  });

  it("should identify the correct price key and calculate totals accurately", () => {
    // Arrange
    const metadata = { 
      id: "text", 
      produto: "text", 
      valor_venda: "numeric",
    };
    const rows = [
      { id: "1", produto: "Teclado", valor_venda: 150.50 },
      { id: "2", produto: "Mouse", valor_venda: 50.00 },
    ] as unknown as IDashboardRow[];

    // Act
    const { totalRevenue, orderCount, averageTicket } = calculateDashboardStats(rows, metadata);

    // Assert
    expect(totalRevenue).toBe(200.50);
    expect(orderCount).toBe(2);
    expect(averageTicket).toBe(100.25);
  });

  it("should fallback to the first numeric key if no keyword match is found", () => {
    // Arrange
    const metadata = { 
      unidades: "numeric",
      sku: "text", 
    };
    const rows = [
      { unidades: 10 },
      { unidades: 20 },
    ] as unknown as IDashboardRow[];

    // Act
    const result = calculateDashboardStats(rows, metadata);

    // Assert
    expect(result.totalRevenue).toBe(30);
    expect(result.orderCount).toBe(2);
  });

  it("should handle rows with invalid or missing numeric data gracefully", () => {
    // Arrange
    const metadata = { preco: "numeric" };
    const rows = [
      { preco: 100 },
      { preco: "texto-invalido" },
      { preco: null },
    ] as unknown as IDashboardRow[];

    // Act
    const result = calculateDashboardStats(rows, metadata);

    // Assert
    expect(result.totalRevenue).toBe(100);
    expect(result.averageTicket).toBe(100 / 3);
  });

});
