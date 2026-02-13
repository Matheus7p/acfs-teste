import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from 'util';

global.console = {
  ...console,
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;