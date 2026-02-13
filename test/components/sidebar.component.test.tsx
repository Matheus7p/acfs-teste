import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/hooks/use-sidebar-data", () => ({
  useSidebarData: jest.fn(),
}));
jest.mock("@/hooks/use-sidebar-controls", () => ({
  useSidebarControls: jest.fn(),
}));


import { Sidebar } from "@/components/sidebar.component";
import { useSidebarControls } from "@/hooks/use-sidebar-controls";
import { useSidebarData } from "@/hooks/use-sidebar-data";

describe("Sidebar Component", () => {
  const mockHandleSelect = jest.fn();
  const mockToggle = jest.fn();
  const mockClose = jest.fn();

  const defaultControls = {
    isOpen: false,
    toggle: mockToggle,
    close: mockClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSidebarControls as jest.Mock).mockReturnValue(defaultControls);
  });

  it("should render loading state correctly", () => {
    // Arrange
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: [],
      isLoading: true,
      selectedId: null,
      handleSelect: jest.fn(),
    });

    // Act
    const { container } = render(<Sidebar />);

    // Assert
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("should render empty state when no uploads exist", () => {
    // Arrange
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: [],
      isLoading: false,
      selectedId: null,
      handleSelect: mockHandleSelect,
    });

    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByText(/Nenhum histórico/i)).toBeInTheDocument();
  });

  it("should render a list of uploads", () => {
    // Arrange
    const mockUploads = [
      { id: "1", filename: "file1.xlsx", uploaded_at: "2023-01-01T10:00:00Z" },
      { id: "2", filename: "file2.xlsx", uploaded_at: "2023-01-02T10:00:00Z" },
    ];
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      selectedId: null,
      handleSelect: mockHandleSelect,
    });

    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByText("file1.xlsx")).toBeInTheDocument();
    expect(screen.getByText("file2.xlsx")).toBeInTheDocument();
    expect(screen.getAllByText("01/01/2023")).toHaveLength(1);
  });

  it("should call handleSelect and close when an item is clicked", () => {
    // Arrange
    const mockUploads = [{ id: "123", filename: "test.xlsx", uploaded_at: "2026-01-01" }];
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      selectedId: null,
      handleSelect: mockHandleSelect,
    });
    render(<Sidebar />);

    // Act
    const itemButton = screen.getByText("test.xlsx").closest("button");
    if (itemButton) fireEvent.click(itemButton);

    // Assert
    expect(mockHandleSelect).toHaveBeenCalledWith("123");
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should toggle the sidebar when the menu button is clicked", () => {
    // Arrange
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: [],
      isLoading: false,
      selectedId: null,
      handleSelect: mockHandleSelect,
    });
    render(<Sidebar />);

    // Act
    const toggleButton = screen.getByRole("button", { name: "" });
    fireEvent.click(toggleButton);

    // Assert
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("should highlight the selected item", () => {
    // Arrange
    const mockUploads = [{ id: "active-id", filename: "active.xlsx", uploaded_at: "2025-01-01" }];
    (useSidebarData as jest.Mock).mockReturnValue({
      uploads: mockUploads,
      isLoading: false,
      selectedId: "active-id",
      handleSelect: mockHandleSelect,
    });

    // Act
    render(<Sidebar />);

    // Assert
    const itemButton = screen.getByText("active.xlsx").closest("button");
    expect(itemButton).toHaveClass("bg-blue-600/20");
  });
});
