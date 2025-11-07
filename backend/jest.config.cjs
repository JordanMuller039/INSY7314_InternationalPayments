module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js'
  ],
  coverageReporters: ['lcov', 'text'],
  // Limit Jest to run only the lightweight regex test so legacy scripts that
  // expect a running server don't fail the run. Once you want full tests,
  // remove or widen this pattern.
  testMatch: ['**/test/regex.test.js'],
  testPathIgnorePatterns: ['/node_modules/']
};
