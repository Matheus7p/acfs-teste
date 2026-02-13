/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { PieChartCard } from "@/components/ui/pie-chart-card.ui";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: ({ data, label }: any) => (
    <div>
      {data.map((entry: any, i: number) => (
        <div key={i}>
          {typeof label === "function" 
            ? label({ name: entry.name, percent: entry.value / 1500 })
            : entry.name}
        </div>
      ))}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Legend: () => <div>Vendas Services Legend Mock</div>,
  Tooltip: () => null,
}));

describe("PieChartCard Component", () => {
  const mockData = [
    { name: "Vendas", value: 1000 },
    { name: "Serviços", value: 500 },
  ];
  const mockTitle = "Distribuição de Receita";

  it("should render the title correctly (AAA)", () => {
    // Arrange
    render(<PieChartCard title={mockTitle} data={mockData} />);
    // Act
    const title = screen.getByText(mockTitle);
    // Assert
    expect(title).toBeInTheDocument();
  });

  it("should render data labels based on provided data", () => {
    // Arrange & Act
    render(<PieChartCard title={mockTitle} data={mockData} />);

    // Assert
    expect(screen.getByText(/Vendas 67%/i)).toBeInTheDocument();
    expect(screen.getByText(/Serviços 33%/i)).toBeInTheDocument();
  });
});
