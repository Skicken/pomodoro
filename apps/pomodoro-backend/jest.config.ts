/* eslint-disable */
export default {
  displayName: 'pomodoro-backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  runner: "groups",
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/pomodoro-backend',

};
