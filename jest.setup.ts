import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

global.console = {
  ...console,
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
