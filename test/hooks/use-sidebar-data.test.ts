import { renderHook, act } from "@testing-library/react";

import { useSupabase } from "@/context/supabase.context";
import { useSidebarData } from "@/hooks/use-sidebar-data";


// Mock
jest.mock("@/context/supabase.context", () => ({
  useSupabase: jest.fn(),
}));

describe("useSidebarData", () => {
  const mockSelectUpload = jest.fn();
  const mockUploads = [
    { id: "1", filename: "file1.csv", rows: [], metadata: {}, uploaded_at: "2023-01-01" },
    { id: "2", filename: "file2.csv", rows: [], metadata: {}, uploaded_at: "2023-01-02" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data correctly from context", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      currentData: { id: "1" },
      selectUpload: mockSelectUpload,
    });

    // Act
    const { result } = renderHook(() => useSidebarData());

    // Assert
    expect(result.current.uploads).toEqual(mockUploads);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedId).toBe("1");
  });

  it("should call selectUpload when handleSelect is triggered", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      currentData: null,
      selectUpload: mockSelectUpload,
    });
    const { result } = renderHook(() => useSidebarData());

    // Act
    act(() => {
      result.current.handleSelect("2");
    });

    // Assert
    expect(mockSelectUpload).toHaveBeenCalledWith("2");
    expect(mockSelectUpload).toHaveBeenCalledTimes(1);
  });

  it("should handle undefined selectedId when currentData is null", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      currentData: null,
      selectUpload: mockSelectUpload,
    });

    // Act
    const { result } = renderHook(() => useSidebarData());

    // Assert
    expect(result.current.selectedId).toBeUndefined();
  });

  it("should maintain the handleSelect reference across re-renders", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      uploads: [],
      isLoading: false,
      currentData: null,
      selectUpload: mockSelectUpload,
    });
    const { result, rerender } = renderHook(() => useSidebarData());
    const initialHandleSelect = result.current.handleSelect;

    // Act
    rerender();

    // Assert
    expect(result.current.handleSelect).toBe(initialHandleSelect);
  });
});
