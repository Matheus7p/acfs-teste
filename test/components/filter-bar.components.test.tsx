import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import { FilterBar } from "@/components/filter-bar.component";

describe("FilterBar Component", () => {
  const mockCategories = ["Alimentação", "Lazer"];
  const mockMonths = ["Janeiro", "Fevereiro"];
  const mockFilters = { categoria: "all", mes: "all" };
  const mockSetFilters = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar as categorias e meses corretamente", () => {
    // Arrange
    render(
      <FilterBar
        categories={mockCategories}
        months={mockMonths}
        filters={mockFilters}
        setFilters={mockSetFilters}
        onClear={mockOnClear}
      />,
    );

    // Assert
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Janeiro")).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar Categoria/i)).toHaveValue("all");
  });

  it("deve chamar setFilters quando uma nova categoria for selecionada", () => {
    // Arrange
    render(
      <FilterBar
        categories={mockCategories}
        months={mockMonths}
        filters={mockFilters}
        setFilters={mockSetFilters}
        onClear={mockOnClear}
      />,
    );
    const selectCategoria = screen.getByLabelText(/Filtrar Categoria/i);

    // Act
    fireEvent.change(selectCategoria, { target: { value: "Alimentação" } });

    // Assert
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...mockFilters,
      categoria: "Alimentação",
    });
  });

  it("deve chamar onClear quando o botão de limpar for clicado", () => {
    // Arrange
    render(
      <FilterBar
        categories={mockCategories}
        months={mockMonths}
        filters={mockFilters}
        setFilters={mockSetFilters}
        onClear={mockOnClear}
      />,
    );
    const button = screen.getByRole("button", { name: /Limpar Filtros/i });

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
