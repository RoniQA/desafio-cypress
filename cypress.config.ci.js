const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
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
      require('@shelex/cypress-allure-plugin/writer')(on, config, {
        outputDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false
      });
      
      // Tasks para coleta de métricas e evidências
      const metrics = []
      const evidence = []
      
      on('task', {
        addMetric(metric) {
          metrics.push(metric)
          return null
        },
        
        saveMetrics(metricData) {
          metrics.push(metricData)
          return null
        },
        
        saveEvidence(evidenceData) {
          evidence.push(evidenceData)
          return null
        },
        
        generateDetailedReport() {
          const reportData = {
            timestamp: new Date().toISOString(),
            metrics,
            evidence,
            summary: {
              totalMetrics: metrics.length,
              totalEvidence: evidence.length,
              testDuration: Date.now() - new Date(metrics[0]?.timestamp || Date.now()).getTime()
            }
          }
          
          // Salva relatório detalhado
          const reportPath = require('path').join('cypress', 'reports', 'detailed-report.json')
          require('fs').writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
          
          return reportPath
        }
      })
      
      // Hook para gerar relatório detalhado após os testes
      on('after:run', async (results) => {
        try {
          // Cria diretório se não existir
          const fs = require('fs')
          const path = require('path')
          const reportsDir = path.join('cypress', 'reports')
          
          if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true })
          }
          
          // Gera relatório detalhado
          const reportData = {
            timestamp: new Date().toISOString(),
            metrics,
            evidence,
            summary: {
              totalMetrics: metrics.length,
              totalEvidence: evidence.length,
              testDuration: Date.now() - new Date(metrics[0]?.timestamp || Date.now()).getTime()
            },
            performance: {
              totalDuration: results.totalDuration,
              browser: results.browserName,
              version: results.browserVersion
            }
          }
          
          // Salva relatório final
          const finalReportPath = path.join(reportsDir, 'final-report.json')
          fs.writeFileSync(finalReportPath, JSON.stringify(reportData, null, 2))
          
          console.log('✅ Relatório detalhado gerado com sucesso!')
        } catch (error) {
          console.error('❌ Erro ao gerar relatório:', error.message)
        }
      })
      
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
