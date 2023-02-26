module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  displayName: {
    name: 'Test',
    color: 'blue',
  },
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.spec.ts'],
};
