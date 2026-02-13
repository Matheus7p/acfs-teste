import { render, screen } from "@testing-library/react";

import { StatCard } from "@/components/ui/stat-card.ui";


describe("StatCard Component", () => {
  
  it("should render the title and value correctly (Arrange, Act, Assert)", () => {
    // Arrange
    const props = {
      title: "Vendas Totais",
      value: "R$ 1.500,00",
    };

    // Act
    render(<StatCard {...props} />);

    // Assert
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.value)).toBeInTheDocument();
  });

  it("should apply the default color class when no colorClass is provided", () => {
    // Arrange
    const title = "Título Padrão";
    const value = 100;

    // Act
    render(<StatCard title={title} value={value} />);
    const valueElement = screen.getByText("100");

    // Assert
    expect(valueElement).toHaveClass("text-slate-900");
  });

  it("should apply a custom color class when provided", () => {
    // Arrange
    const customColor = "text-green-600";
    
    // Act
    render(<StatCard title="Ganho" value="R$ 50,00" colorClass={customColor} />);
    const valueElement = screen.getByText(/R\$.*50,00/);

    // Assert
    expect(valueElement).toHaveClass(customColor);
    expect(valueElement).not.toHaveClass("text-slate-900");
  });

  it("should have the correct container styling", () => {
    // Arrange
    render(<StatCard title="UI Test" value="0" />);
    
    // Act
    const container = screen.getByText("UI Test").parentElement;

    // Assert
    expect(container).toHaveClass("bg-white", "rounded-xl", "border-slate-200");
  });
});
