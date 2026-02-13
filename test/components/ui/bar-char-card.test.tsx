/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from "@testing-library/react";

import { BarChartCard } from "@/components/ui/bar-char-card.ui";
import * as formatUtils from "@/utils/formatBRL.utils";

jest.spyOn(formatUtils, "formatBRL").mockImplementation((val) => `R$ ${val}`);

let capturedYAxisProps: any = null;
let capturedTooltipProps: any = null;

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: (props: any) => {
    capturedYAxisProps = props;
    return null;
  },
  CartesianGrid: () => null,
  Tooltip: (props: any) => {
    capturedTooltipProps = props;
    return null;
  },
}));

describe("BarChartCard Component - Deep Coverage", () => {
  const mockData = [{ name: "Jan", value: 4000 }];
  const mockTitle = "Faturamento";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly define the YAxis tickFormatter function (AAA)", () => {
    // Arrange
    render(<BarChartCard title={mockTitle} data={mockData} />);
    
    // Act
    const result = capturedYAxisProps.tickFormatter(5000);

    // Assert
    expect(result).toBe("R$ 5k");
  });

  it("should call formatBRL inside Tooltip formatter (AAA)", () => {
    // Arrange
    render(<BarChartCard title={mockTitle} data={mockData} />);

    // Act
    const [formattedValue, label] = capturedTooltipProps.formatter(1000);

    // Assert
    expect(label).toBe("Vendas");
    expect(formatUtils.formatBRL).toHaveBeenCalledWith(1000);
    expect(formattedValue).toBe("R$ 1000");
  });

  it("should render the title correctly (AAA)", () => {
    // Arrange & Act
    const { getByText } = render(<BarChartCard title={mockTitle} data={mockData} />);
    
    // Assert
    expect(getByText(mockTitle)).toBeInTheDocument();
  });
});
