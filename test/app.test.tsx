import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App", () => {
  it("Teste tecnico", () => {
   render(<App />);
   expect(screen.getByText(/Teste tecnico/i)).toBeInTheDocument()
  });
});
