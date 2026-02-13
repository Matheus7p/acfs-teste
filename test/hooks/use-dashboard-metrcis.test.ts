/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from "@testing-library/react";

import { processDashboardValue, useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

describe("processDashboardValue (Utility Function)", () => {
  it("should return 0 for invalid numbers", () => {
    // Arrange & Act & Assert
    expect(processDashboardValue("abc")).toBe(0);
    expect(processDashboardValue(undefined)).toBe(0);
  });

  it("should correct large integer values (dividing by 100)", () => {
    // Arrange
    const rawValue = 150000; 

    // Act
    const result = processDashboardValue(rawValue);

    // Assert
    expect(result).toBe(1500);
  });

  it("should NOT divide by 100 if the value is not a large integer", () => {
    expect(processDashboardValue(500)).toBe(500);
    expect(processDashboardValue(1500.50)).toBe(1500.50);
  });
});

describe("useDashboardMetrics (Hook)", () => {
  const mockMetadata = {
    produto: "categorical",
    preco_venda: "numeric",
    categoria_item: "categorical",
  };

  const mockRows = [
    { produto: "Teclado", preco_venda: 100, categoria_item: "Periféricos" },
    { produto: "Mouse", preco_venda: 200, categoria_item: "Periféricos" },
  ];

  it("should calculate metrics correctly (AAA)", () => {
    // Arrange 
    const { result } = renderHook(() => useDashboardMetrics(mockRows as any, mockMetadata));

    // Act 
    const { totalRevenue, orderCount, averageTicket } = result.current;

    // Assert 
    expect(totalRevenue).toBe(300);
    expect(orderCount).toBe(2);
    expect(averageTicket).toBe(150);
  });

  it("should automatically identify the correct valueKey and categoryKey", () => {
    // Arrange 
    const { result } = renderHook(() => useDashboardMetrics(mockRows as any, mockMetadata));

    // Assert 
    expect(result.current.valueKey).toBe("preco_venda");
    expect(result.current.categoryKey).toBe("categoria_item");
  });

  it("should return default values when rows are empty", () => {
    // Arrange 
    const { result } = renderHook(() => useDashboardMetrics([], {}));

    // Assert 
    expect(result.current.totalRevenue).toBe(0);
    expect(result.current.orderCount).toBe(0);
    expect(result.current.valueKey).toBe("");
  });

  it("should fallback to first numeric key if no specific revenue keyword is found", () => {
    // Arrange 
    const altMetadata = { aleatorio: "numeric", algo: "categorical" };
    const altRows = [{ aleatorio: 50 }];

    const { result } = renderHook(() => useDashboardMetrics(altRows as any, altMetadata));

    // Assert 
    expect(result.current.valueKey).toBe("aleatorio");
    expect(result.current.totalRevenue).toBe(50);
  });
});
