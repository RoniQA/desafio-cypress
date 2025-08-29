const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.amazon.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts otimizados para CI/CD
    defaultCommandTimeout: 8000,
    requestTimeout: 8000,
    responseTimeout: 8000,
    
    // Configurações para performance em CI/CD
    video: false, // Desabilita vídeo para maior velocidade
    screenshotOnRunFailure: true,
    
    // Otimizações de Performance para CI/CD
    experimentalRunAllSpecs: true,
    
    // Configurações para Paralelização
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    // Configurações específicas para navegador headless
    browser: 'chrome',
    chromeWebSecurity: false,
    
    // Configurações para GitHub Actions
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true,
    
    // Configurações para CI/CD
    watchForFileChanges: false,
    scrollBehavior: false,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  // Configurações para CI/CD
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
})
