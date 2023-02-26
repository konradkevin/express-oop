module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  displayName: {
    name: 'E2E',
    color: 'magenta',
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
};
