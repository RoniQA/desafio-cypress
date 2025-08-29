const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.amazon.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    
    // Otimizações de Performance
    experimentalRunAllSpecs: true,
    experimentalModifyObstructiveThirdPartyCode: false,
    experimentalSkipDomainInjection: ['amazon.com'],
    
    // Configurações para Paralelização
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  // Configurações para CI/CD e Paralelização
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
})
