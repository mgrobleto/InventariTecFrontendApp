import type { Config } from "jest";

const config : Config = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': ['jest-preset-angular', {
            tsconfig: '<rootDir>/tsconfig.spec.json'
        }],
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    '\\.scss$': 'identity-obj-proxy', // Evita problemas con estilos
    '\\.html$': '<rootDir>/__mocks__/htmlMock.js' // Mockea los templates
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
}

export default config;