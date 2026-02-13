const config = {
  testEnvironment: "jsdom",

  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  collectCoverageFrom: [
    "src/**",
    "!src/**/*.type.ts",
    "!src/main.tsx",
    "!src/**/*.response.ts",
    "!src/**/*.enum.ts",
    "!src/env.mjs",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  transformIgnorePatterns: [
    "/node_modules/(?!(better-auth)/)",
  ],
};

export default config;
