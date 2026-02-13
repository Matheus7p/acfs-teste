import { render, screen, waitFor, act } from "@testing-library/react";

import { useSupabase, SupabaseProvider } from "@/context/supabase.context";


jest.mock("@/env.mjs", () => ({
  env: {
    VITE_SUPABASE_URL: "https://example.supabase.co",
    VITE_SUPABASE_KEY: "fake-key",
  },
}));


jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [
            { id: "1", filename: "data.csv", metadata: {}, rows: [], uploaded_at: "2024-01-01" },
          ], 
          error: null, 
        })),
      })),
    })),
  })),
}));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const TestComponent = () => {
  const { uploads, isLoading, addUpload, selectUpload, currentData } = useSupabase();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="count">{uploads.length}</div>
      <div data-testid="current">{currentData?.filename || "none"}</div>
      <button onClick={() => addUpload({ id: "2", filename: "new.csv", metadata: {}, rows: [], uploaded_at: "2024-01-02" })}>
        Add
      </button>
      <button onClick={() => selectUpload("1")}>Select 1</button>
    </div>
  );
};

describe("SupabaseContext", () => {
  it("should fetch and display uploads on mount (AAA)", async () => {
    // Act
    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>,
    );

    // Assert 
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("should update state when adding a new upload (AAA)", async () => {
    // Arrange
    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>,
    );
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Act
    const addButton = screen.getByText("Add");
    act(() => {
      addButton.click();
    });

    // Assert
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("current")).toHaveTextContent("new.csv");
  });

  it("should throw error if useSupabase is used outside provider (AAA)", () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Act & Assert
    expect(() => render(<TestComponent />)).toThrow("useSupabase must be used inside a SupabaseProvider");
    consoleSpy.mockRestore();
  });
});
