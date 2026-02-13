import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { DropzoneField } from "@/components/ui/dropzone-field.ui";

describe("DropzoneField Component", () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the initial state correctly", () => {
    // Arrange
    render(<DropzoneField onFileSelect={mockOnFileSelect} disabled={false} />);

    // Assert
    expect(screen.getByText(/Arraste seu Excel aqui/i)).toBeInTheDocument();
    expect(screen.queryByText(/Processando.../i)).not.toBeInTheDocument();
  });

  it("should render the processing state when disabled is true", () => {
  // Arrange
    const { container } = render(<DropzoneField onFileSelect={jest.fn()} disabled={true} />);
  
    // Act
    // Selecionamos o input diretamente pelo tipo
    const input = container.querySelector("input[type=\"file\"]") as HTMLInputElement;

    // Assert
    expect(screen.getByText(/Processando.../i)).toBeInTheDocument();
    // O react-dropzone desativa o input via lógica, verificamos se ele está lá
    expect(input).toBeInTheDocument();
    // Se quiser ser rigoroso, verificamos se ele removeu do fluxo de tabulação
    expect(input).toHaveAttribute("tabindex", "-1");
  });

  it("should call onFileSelect when a file is dropped", async () => {
  // Arrange
    const mockOnFileSelect = jest.fn();
    const { container } = render(<DropzoneField onFileSelect={mockOnFileSelect} disabled={false} />);
    const file = new File(["content"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const input = container.querySelector("input[type=\"file\"]") as HTMLInputElement;

    // Act
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    // Assert
    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it("should show 'Solte o arquivo' text when a file is being dragged over", async () => {
  // Arrange
    const { container } = render(<DropzoneField onFileSelect={jest.fn()} disabled={false} />);
    const dropzone = container.firstChild as HTMLElement;

    // Act
    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        files: [new File([""], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })],
        types: ["Files"],
      },
    });

    // Assert
    expect(await screen.findByText(/Solte o arquivo/i)).toBeInTheDocument();
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  it("should not call onFileSelect if disabled is true", async () => {
  // Arrange
    const mockOnFileSelect = jest.fn();
    const { container } = render(<DropzoneField onFileSelect={mockOnFileSelect} disabled={true} />);
    const file = new File(["content"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const input = container.querySelector("input[type=\"file\"]") as HTMLInputElement;

    // Act
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    // Assert
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });
});
