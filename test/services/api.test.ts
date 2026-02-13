import axios from "axios";

import { env } from "@/env.mjs";
import { api } from "@/services/api.service";

// Mock
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("@/env.mjs", () => ({
  env: {
    VITE_API_URL: "http://localhost:3000",
  },
}));

describe("API Service Instance", () => {
  it("should create an axios instance with the correct base URL", () => {
    // Assert
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: env.VITE_API_URL,
      }),
    );
  });

  it("should export a valid axios instance", () => {
    // Assert
    expect(api).toBeDefined();
    expect(typeof api.get).toBe("function");
    expect(typeof api.post).toBe("function");
  });
});
