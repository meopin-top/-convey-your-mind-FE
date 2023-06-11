const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleDirectories: [".yarn", "<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/.yarn/"],
  testEnvironment: "jsdom",
}

module.exports = createJestConfig(customJestConfig)
