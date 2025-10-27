const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    reporter: 'cypress-allure-plugin',
    reporterOptions: {
      allure: {
        outputDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false
      }
    },
    baseUrl: 'https://www.amazon.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts otimizados para CI/CD
    defaultCommandTimeout: 15000, // Aumentado para 15s
    requestTimeout: 15000,
    responseTimeout: 15000,
    
    // Configurações para performance em CI/CD
    video: false, // Desabilita vídeo para maior velocidade
    screenshotOnRunFailure: true,
    
    // Otimizações de Performance para CI/CD
    experimentalRunAllSpecs: true,
    
    // Configurações para Paralelização
    retries: {
      runMode: 2, // Aumentado para 2 tentativas
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
    
    // Configurações específicas para GitHub Actions
    modifyObstructiveCode: false,
    
    // Configurações de viewport para CI/CD
    viewportWidth: 1366,
    viewportHeight: 768,
    
    setupNodeEvents(on, config) {
      require('@shelex/cypress-allure-plugin/writer')(on, config);
      return config;
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
