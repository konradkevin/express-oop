module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  displayName: {
    name: 'UNIT',
    color: 'blue',
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
};
