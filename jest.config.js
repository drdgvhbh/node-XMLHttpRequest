module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  modulePathIgnorePatterns: ['dummy-server-worker'],
};
