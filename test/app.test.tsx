import { render, screen } from "@testing-library/react";

import { App } from "@/App";
import { useSupabase } from "@/context/supabase.context";


// Mocks
jest.mock("@/context/supabase.context", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("@/components/file-uploader.component", () => ({
  FileUploader: () => <div data-testid="file-uploader">File Uploader</div>,
}));

jest.mock("@/components/sidebar.component", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("App Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the empty state when no data is selected", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      currentData: null,
    });

    // Act
    render(<App />);

    // Assert
    expect(screen.getByText(/Selecione ou faça upload de uma planilha/i)).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("file-uploader")).toBeInTheDocument();
    expect(screen.queryByText(/Linhas Processadas/i)).not.toBeInTheDocument();
  });

  it("should render the file details and row count when data is present", () => {
    // Arrange
    const mockData = {
      filename: "inventory.csv",
      rows: [
        { id: 1, name: "Item A" },
        { id: 2, name: "Item B" },
        { id: 3, name: "Item C" },
      ],
    };

    (useSupabase as jest.Mock).mockReturnValue({
      currentData: mockData,
    });

    // Act
    render(<App />);

    // Assert
    expect(screen.getByText(`Visualizando: ${mockData.filename}`)).toBeInTheDocument();
    expect(screen.getByText(/Linhas Processadas/i)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should maintain layout structure with main elements", () => {
    // Arrange
    (useSupabase as jest.Mock).mockReturnValue({
      currentData: null,
    });

    // Act
    render(<App />);

    // Assert
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
