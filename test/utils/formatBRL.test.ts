import { formatBRL } from "@/utils/formatBRL.utils";


describe("formatBRL util", (): void => {
  it("should format a positive number to BRL currency string", (): void => {
    // Arrange
    const value = 1250.5;

    // Act
    const result = formatBRL(value);

    // Assert
    expect(result.replace(/\u00a0/g, " ")).toBe("R$ 1.250,50");
  });

  it("should format zero correctly", (): void => {
    // Act
    const result = formatBRL(0);

    // Assert
    expect(result.replace(/\u00a0/g, " ")).toBe("R$ 0,00");
  });

  it("should format negative numbers correctly", (): void => {
    // Arrange
    const value = -50.25;

    // Act
    const result = formatBRL(value);

    // Assert
    expect(result.replace(/\u00a0/g, " ")).toContain("R$");
    expect(result).toContain("50,25");
  });
});
