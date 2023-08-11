/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!troublesome-dependency/.*)"],
  coverageDirectory: "./coverage/",
  coverageReporters: ["json", "lcov", "html"],
  collectCoverageFrom: ["packages/**/src/**/*.ts"],
  testPathIgnorePatterns: ["node_modules/", "dist/"],
  moduleFileExtensions: ["ts", "js"],
};
