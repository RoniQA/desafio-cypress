const { defineConfig } = require('cypress')
const fs = require('fs')
const path = require('path')

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
    experimentalRunAllSpecs: true,
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    // Configuração para relatórios Mochawesome
    reporter: 'mochawesome',
    reporterOptions: {
      mochawesome: {
        overwrite: false,
        html: false,
        json: true,
        reportDir: 'cypress/reports',
        reportFilename: '[datetime]_[name]_report.json'
      }
    },
    
    setupNodeEvents(on, config) {
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
          const reportPath = path.join('cypress', 'reports', 'detailed-report.json')
          fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
          
          return reportPath
        }
      })
      
      // Hook para gerar relatório detalhado após os testes
      on('after:run', async (results) => {
        // Gera relatório detalhado
        await config.env.runTask('generateDetailedReport')
        
        // Adiciona resultados dos testes ao relatório
        const detailedResults = {
          ...results,
          metrics,
          evidence,
          performance: {
            totalDuration: results.totalDuration,
            avgDuration: results.totalDuration / results.runs.length,
            browser: results.browserName,
            version: results.browserVersion
          }
        }
        
        // Salva relatório final
        const finalReportPath = path.join('cypress', 'reports', 'final-report.json')
        fs.writeFileSync(finalReportPath, JSON.stringify(detailedResults, null, 2))
      })
    }
  }
})
