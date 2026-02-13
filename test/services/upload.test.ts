import { api } from "@/services/api.service";
import { uploadService } from "@/services/upload.service";

// Mock
jest.mock("@/services/api.service", () => ({
  api: {
    post: jest.fn(),
  },
}));

describe("uploadService", (): void => {
  const mockFile = new File(["content"], "test.csv", { type: "text/csv" });
  
  const mockResponse = {
    status: "success",
    db_id: "123",
    data: [{ id: 1 }],
    metadata: { id: "numeric" },
    message: "Success",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should send the file correctly using FormData", async (): Promise<void> => {
    // Arrange
    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    // Act
    const result = await uploadService.processFile(mockFile);

    // Assert
    expect(api.post).toHaveBeenCalledWith(
      "/api/process",
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );

    const formDataSent = (api.post as jest.Mock).mock.calls[0][1] as FormData;
    expect(formDataSent.get("file")).toEqual(mockFile);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if the api call fails", async (): Promise<void> => {
    // Arrange
    const apiError = new Error("Network Error");
    (api.post as jest.Mock).mockRejectedValueOnce(apiError);

    // Act & Assert
    await expect(uploadService.processFile(mockFile)).rejects.toThrow("Network Error");
  });
});
