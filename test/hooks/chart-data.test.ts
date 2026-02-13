/* eslint-disable @typescript-eslint/no-explicit-any */
import { processDashboardValue } from "@/hooks/use-dashboard-metrics";
import { aggregateDataByKey } from "@/utils/chart-data.utils";

jest.mock("@/hooks/use-dashboard-metrics", () => ({
  processDashboardValue: jest.fn((val) => Number(val) || 0),
}));

describe("aggregateDataByKey", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockRows = [
    { categoria: "Eletrônicos", preco: 100.5 },
    { categoria: "Eletrônicos", preco: 50.254 },
    { categoria: "Livros", preco: 30.0 },
    { categoria: null, preco: 10.0 },
  ];

  it("should aggregate values correctly by a given key and format to 2 decimal places", () => {
    // Arrange
    const targetKey = "categoria";
    const valueKey = "preco";

    // Act
    const result = aggregateDataByKey(mockRows as any, targetKey, valueKey);

    // Assert
    expect(result).toHaveLength(3);
    
    expect(result).toEqual(
      expect.arrayContaining([
        { name: "Eletrônicos", value: 150.75 },
        { name: "Livros", value: 30 },
        { name: "Outros", value: 10 },
      ]),
    );
  });

  it("should return an empty array if required arguments are missing", () => {
    // Arrange 
    const rows: any[] = [];

    // Act 
    const result = aggregateDataByKey(rows, "", "");

    // Assert 
    expect(result).toEqual([]);
  });

  it("should call processDashboardValue for each row", () => {
    // Arrange 
    const targetKey = "categoria";
    const valueKey = "preco";

    // Act 
    aggregateDataByKey(mockRows as any, targetKey, valueKey);

    // Assert 
    expect(processDashboardValue).toHaveBeenCalledTimes(mockRows.length);
  });
});
