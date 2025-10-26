const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.amazon.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: false,
    screenshotOnRunFailure: true,
    experimentalRunAllSpecs: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    browser: 'chrome',
    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true,
    watchForFileChanges: false,
    scrollBehavior: false,
    modifyObstructiveCode: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
})