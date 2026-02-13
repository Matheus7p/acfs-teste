import { renderHook, act } from "@testing-library/react";
import axios from "axios";

import { useSupabase } from "@/context/supabase.context";
import { useFileUpload } from "@/hooks/use-file-upload";


// Mocks
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@/context/supabase.context", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("@/env.mjs", () => ({
  env: { VITE_API_URL: "http://localhost:3000" },
}));

describe("useFileUpload", () => {
  const addUploadMock = jest.fn();
  const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

  beforeEach(() => {
    jest.clearAllMocks();
    (useSupabase as jest.Mock).mockReturnValue({ addUpload: addUploadMock });
  });

  it("should initialize with default states", () => {
    // Arrange & Act
    const { result } = renderHook(() => useFileUpload());

    // Assert
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errorMessage).toBe(null);
  });

  it("should upload file successfully and call addUpload", async () => {
    // Arrange
    const mockResponse = {
      data: {
        status: "success",
        db_id: "123",
        data: [{ id: 1 }],
        metadata: { id: "numeric" },
        message: "Success",
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async () => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(addUploadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        filename: "test.csv",
      }),
    );
  });

  it("should set error message when API returns status error", async () => {
    // Arrange
    const errorMessage = "Invalid file format";
    const mockResponse = {
      data: {
        status: "error",
        message: errorMessage,
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async () => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(result.current.errorMessage).toBe(errorMessage);
    expect(result.current.isUploading).toBe(false);
    expect(addUploadMock).not.toHaveBeenCalled();
  });

  it("should handle network errors gracefully", async () => {
    // Arrange
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));
    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async () => {
      await result.current.uploadFile(mockFile);
    });

    // Assert
    expect(result.current.errorMessage).toBe("Falha ao processar o arquivo. Tente novamente.");
    expect(result.current.isUploading).toBe(false);
  });
});
