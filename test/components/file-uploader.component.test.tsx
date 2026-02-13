import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/env.mjs", () => ({
  env: { VITE_API_URL: "http://localhost:3000" },
}));

jest.mock("@/hooks/use-file-upload", () => ({
  useFileUpload: jest.fn(),
}));

import { FileUploader } from "@/components/file-uploader.component";
import { useFileUpload } from "@/hooks/use-file-upload";


// Mock
jest.mock("@/hooks/use-file-upload");

jest.mock("@/components/ui/dropzone-field.ui", () => ({
  // eslint-disable-next-line react/prop-types
  DropzoneField: ({ onFileSelect, disabled }) => (
    <button 
      data-testid="mock-dropzone" 
      disabled={disabled} 
      onClick={() => onFileSelect(new File([], "test.xlsx"))}
    >
      {disabled ? "Uploading..." : "Upload"}
    </button>
  ),
}));

describe("FileUploader Component", () => {
  const mockUploadFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the dropzone and no error message by default", () => {
    // Arrange
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: mockUploadFile,
      isUploading: false,
      errorMessage: null,
    });

    // Act
    render(<FileUploader />);

    // Assert
    expect(screen.getByTestId("mock-dropzone")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should disable the dropzone when uploading", () => {
    // Arrange
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: mockUploadFile,
      isUploading: true,
      errorMessage: null,
    });

    // Act
    render(<FileUploader />);

    // Assert
    const dropzone = screen.getByTestId("mock-dropzone");
    expect(dropzone).toBeDisabled();
    expect(screen.getByText(/Uploading.../i)).toBeInTheDocument();
  });

  it("should display an error message when errorMessage is present", () => {
    // Arrange
    const errorText = "Invalid file type";
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: mockUploadFile,
      isUploading: false,
      errorMessage: errorText,
    });

    // Act
    render(<FileUploader />);

    // Assert
    const errorContainer = screen.getByText(errorText);
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer.closest("div")).toHaveClass("text-destructive");
  });

  it("should call uploadFile from the hook when a file is selected", () => {
    // Arrange
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: mockUploadFile,
      isUploading: false,
      errorMessage: null,
    });
    render(<FileUploader />);

    // Act
    fireEvent.click(screen.getByTestId("mock-dropzone"));

    // Assert
    expect(mockUploadFile).toHaveBeenCalledTimes(1);
    expect(mockUploadFile).toHaveBeenCalledWith(expect.any(File));
  });
});
