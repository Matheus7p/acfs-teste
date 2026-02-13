import { renderHook, act } from "@testing-library/react";

import { useSidebarControls } from "@/hooks/use-sidebar-controls";


describe("useSidebarControls", () => {
  it("should initialize with isOpen as false", () => {
    // Arrange & Act
    const { result } = renderHook(() => useSidebarControls());

    // Assert
    expect(result.current.isOpen).toBe(false);
  });

  it("should toggle isOpen state when toggle is called", () => {
    // Arrange
    const { result } = renderHook(() => useSidebarControls());

    // Act
    act(() => {
      result.current.toggle();
    });

    // Assert
    expect(result.current.isOpen).toBe(true);

    // Act
    act(() => {
      result.current.toggle();
    });

    // Assert
    expect(result.current.isOpen).toBe(false);
  });

  it("should set isOpen to false when close is called", () => {
    // Arrange
    const { result } = renderHook(() => useSidebarControls());
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Act
    act(() => {
      result.current.close();
    });

    // Assert
    expect(result.current.isOpen).toBe(false);
  });

  it("should maintain the same function references (memoization)", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useSidebarControls());
    const initialToggle = result.current.toggle;
    const initialClose = result.current.close;

    // Act
    rerender();

    // Assert
    expect(result.current.toggle).toBe(initialToggle);
    expect(result.current.close).toBe(initialClose);
  });
});
