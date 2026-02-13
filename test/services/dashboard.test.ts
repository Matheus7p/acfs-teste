import { supabase } from "@/lib/supabase";
import { dashboardService } from "@/services/dashboard.service";
import { IDashboardData } from "@/types/dashboard-data.type";

// Mock
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("dashboardService", (): void => {
  const mockData: IDashboardData[] = [
    {
      id: "123",
      filename: "test.csv",
      metadata: {},
      rows: [],
      uploaded_at: "2024-01-01T00:00:00Z",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  const mockSupabaseQuery = (data: any, error: any = null) => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data, error }),
    };
    (supabase.from as jest.Mock).mockReturnValue(chain);
    return chain;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all uploads successfully in descending order", async (): Promise<void> => {
    // Arrange
    const chain = mockSupabaseQuery(mockData);

    // Act
    const result = await dashboardService.getAllUploads();

    // Assert
    expect(supabase.from).toHaveBeenCalledWith("dashboard_uploads");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.order).toHaveBeenCalledWith("uploaded_at", { ascending: false });
    expect(result).toEqual(mockData);
  });

  it("should return an empty array when no data is returned", async (): Promise<void> => {
    // Arrange
    mockSupabaseQuery(null);

    // Act
    const result = await dashboardService.getAllUploads();

    // Assert
    expect(result).toEqual([]);
  });

  it("should throw an error when Supabase returns an error", async (): Promise<void> => {
    // Arrange
    const mockError = { message: "Database connection failed" };
    mockSupabaseQuery(null, mockError);

    // Act & Assert
    await expect(dashboardService.getAllUploads()).rejects.toEqual(mockError);
  });
});
