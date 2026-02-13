/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { BarChartCard } from "@/components/ui/bar-char-card.ui";


// Mock do Recharts para evitar problemas com SVG e animações
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children, data }: any) => (
    <div data-testid="mock-bar-chart">
      {/* Mockando a renderização dos nomes do XAxis para validar os dados */}
      {data.map((item: any) => (
        <span key={item.name}>{item.name}</span>
      ))}
      {children}
    </div>
  ),
  Bar: () => <div data-testid="mock-bar" />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe("BarChartCard Component", () => {
  const mockData = [
    { name: "Jan", value: 4000 },
    { name: "Fev", value: 3000 },
  ];
  const mockTitle = "Faturamento Mensal";

  it("should render the card title correctly (AAA)", () => {
    // Arrange 
    render(<BarChartCard title={mockTitle} data={mockData} />);

    // Act 
    const titleElement = screen.getByText(mockTitle);

    // Assert 
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-slate-600");
  });

  it("should render all data points labels (AAA)", () => {
    // Arrange 
    render(<BarChartCard title={mockTitle} data={mockData} />);

    // Act 
    const janLabel = screen.getByText("Jan");
    const fevLabel = screen.getByText("Fev");

    // Assert 
    expect(janLabel).toBeInTheDocument();
    expect(fevLabel).toBeInTheDocument();
  });

  it("should apply the correct styles to the container", () => {
    // Arrange 
    const { container } = render(<BarChartCard title={mockTitle} data={mockData} />);
    
    // Act 
    const mainDiv = container.firstChild;

    // Assert 
    expect(mainDiv).toHaveClass("bg-white", "rounded-xl", "shadow-sm");
  });
});
