import { renderHook, act } from "@testing-library/react";

import { useSupabase } from "@/context/supabase.context";
import { useFileUpload } from "@/hooks/use-file-upload";
import { uploadService } from "@/services/upload.service";

// Mocks
jest.mock("@/services/upload.service", () => ({
  uploadService: { processFile: jest.fn() },
}));

jest.mock("@/context/supabase.context", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("@/env.mjs", () => ({
  env: { VITE_API_URL: "http://localhost:3000" },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("useFileUpload hook", (): void => {
  const addUploadMock = jest.fn();
  const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

  beforeEach((): void => {
    jest.clearAllMocks();
    (useSupabase as jest.Mock).mockReturnValue({ addUpload: addUploadMock });
    return;
  });

  it("should initialize with default states", (): void => {
    // Arrange & Act
    const { result } = renderHook(() => useFileUpload());

    // Assert
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errorMessage).toBe(null);

    return;
  });

  it("should upload file successfully and call addUpload", async (): Promise<void> => {
    // Arrange
    const mockResponse = {
      status: "success",
      db_id: "123",
      data: [{ id: 1 }],
      metadata: { id: "numeric" },
      message: "Success",
    };
    (uploadService.processFile as jest.Mock).mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async (): Promise<void> => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(addUploadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        filename: "test.csv",
        metadata: { id: "numeric" },
        rows: [{ id: 1 }],
      }),
    );
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errorMessage).toBe(null);

    return;
  });

  it("should set error message when API returns status error", async (): Promise<void> => {
    // Arrange
    const mockResponse = {
      status: "error",
      message: "Invalid file format",
    };
    (uploadService.processFile as jest.Mock).mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async (): Promise<void> => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(result.current.errorMessage).toBe("Invalid file format");
    expect(result.current.isUploading).toBe(false);
    expect(addUploadMock).not.toHaveBeenCalled();

    return;
  });

  it("should handle network errors gracefully", async (): Promise<void> => {
    // Arrange
    const networkError = new Error("Network Error");
    (uploadService.processFile as jest.Mock).mockRejectedValueOnce(networkError);
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async (): Promise<void> => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(result.current.errorMessage).toBe("Falha ao processar o arquivo. Tente novamente.");
    expect(result.current.isUploading).toBe(false);
    return;
  });
});
