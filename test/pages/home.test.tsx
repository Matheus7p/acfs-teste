import { render, screen } from "@testing-library/react";
import { JSX } from "react";

import "@testing-library/jest-dom";
import { Home } from "@/pages/home";

jest.mock("@/components/sidebar.component", () => {
  return {
    Sidebar: (): JSX.Element => <div data-testid="sidebar">Sidebar</div>,
  };
});

jest.mock("@/components/file-uploader.component", () => {
  return {
    FileUploader: (): JSX.Element => (
      <div data-testid="file-uploader">FileUploader</div>
    ),
  };
});

const mockUseSupabase = jest.fn();

jest.mock("@/context/supabase.context", () => {
  return {
    useSupabase: (): unknown => mockUseSupabase(),
  };
});

describe("Home Page", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    return;
  });

  it("should render default message when currentData is null", (): void => {
    // Arrange
    mockUseSupabase.mockReturnValue({
      currentData: null,
    });

    // Act
    render(<Home />);

    // Assert
    expect(
      screen.getByText("Selecione ou faça upload de uma planilha"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("file-uploader")).toBeInTheDocument();

    return;
  });

  it("should render filename when currentData exists", (): void => {
    // Arrange
    mockUseSupabase.mockReturnValue({
      currentData: {
        filename: "test-file.xlsx",
        rows: [],
      },
    });

    // Act
    render(<Home />);

    // Assert
    expect(
      screen.getByText("Visualizando: test-file.xlsx"),
    ).toBeInTheDocument();

    return;
  });

  it("should display processed rows count when currentData exists", (): void => {
    // Arrange
    mockUseSupabase.mockReturnValue({
      currentData: {
        filename: "data.xlsx",
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    // Act
    render(<Home />);

    // Assert
    expect(screen.getByText("Linhas Processadas")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    return;
  });

  it("should not render processed rows section when currentData is null", (): void => {
    // Arrange
    mockUseSupabase.mockReturnValue({
      currentData: null,
    });

    // Act
    render(<Home />);

    // Assert
    expect(
      screen.queryByText("Linhas Processadas"),
    ).not.toBeInTheDocument();

    return;
  });
});
