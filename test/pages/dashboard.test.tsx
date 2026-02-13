import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";

import { useSupabase } from "@/context/supabase.context";
import { DashboardPage } from "@/pages/dashboard";


// Mocks das dependências
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/context/supabase.context", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("@/components/sidebar.component", () => ({
  Sidebar: () => <div data-testid="mock-sidebar" />,
}));

describe("DashboardPage", () => {
  const mockSelectUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state when filename is not available", () => {
    // Arrange
    (useParams as jest.Mock).mockReturnValue({ fileId: "123" });
    (useSupabase as jest.Mock).mockReturnValue({
      currentData: null,
      uploads: [],
      selectUpload: mockSelectUpload,
    });

    // Act
    render(<DashboardPage />);

    // Assert
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("should calculate and display metrics correctly when data is provided", () => {
    // Arrange
    const mockData = {
      filename: "vendas_fevereiro.csv",
      rows: [
        { valor: 100 },
        { valor: 200 },
        { valor: 300 },
      ],
      metadata: { valor: "numeric" },
    };

    (useParams as jest.Mock).mockReturnValue({ fileId: "file-123" });
    (useSupabase as jest.Mock).mockReturnValue({
      currentData: mockData,
      uploads: [{ id: "file-123" }],
      selectUpload: mockSelectUpload,
    });

    // Act
    render(<DashboardPage />);

    // Assert
    expect(screen.getByText("vendas_fevereiro.csv")).toBeInTheDocument();
    expect(screen.getByText("Receita Total")).toBeInTheDocument();
    expect(screen.getByText(/R\$.*600,00/)).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Ticket Médio")).toBeInTheDocument();
    expect(screen.getByText(/R\$.*200,00/)).toBeInTheDocument();
  });

  it("should call selectUpload when fileId is present and uploads are loaded", () => {
    // Arrange
    const fileId = "test-uuid";
    (useParams as jest.Mock).mockReturnValue({ fileId });
    (useSupabase as jest.Mock).mockReturnValue({
      currentData: null,
      uploads: [{ id: fileId }],
      selectUpload: mockSelectUpload,
    });

    // Act
    render(<DashboardPage />);

    // Assert
    expect(mockSelectUpload).toHaveBeenCalledWith(fileId);
  });
});
