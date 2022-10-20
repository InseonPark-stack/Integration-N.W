module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleDirectories: ['node_modules', 'src'],
    rootDir: 'tests',
    testRegex: '.spec.ts$',
    transformIgnorePatterns: ['/node_modules/mongodb/src/'],
    transform: {
        '^.+\\.(t|j)s$': ['@swc/jest']
    },
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    testTimeout: 15000
}
