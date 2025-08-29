const fs = require('fs')
const path = require('path')

// Função para gerar relatório HTML detalhado
function generateDetailedHTMLReport(reportData) {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Detalhado - Testes Cypress</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header .timestamp { font-size: 1.1em; opacity: 0.9; margin-top: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .value { font-size: 2em; font-weight: bold; color: #667eea; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .metric-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 3px solid #28a745; }
        .evidence-item { background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 3px solid #ffc107; }
        .performance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .performance-card { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; }
        .chart-container { height: 300px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .info { color: #17a2b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Relatório Detalhado - Testes Cypress</h1>
            <div class="timestamp">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total de Métricas</h3>
                <div class="value">${reportData.summary?.totalMetrics || 0}</div>
            </div>
            <div class="summary-card">
                <h3>Total de Evidências</h3>
                <div class="value">${reportData.summary?.totalEvidence || 0}</div>
            </div>
            <div class="summary-card">
                <h3>Duração dos Testes</h3>
                <div class="value">${Math.round((reportData.summary?.testDuration || 0) / 1000)}s</div>
            </div>
            <div class="summary-card">
                <h3>Status</h3>
                <div class="value success">✅ Concluído</div>
            </div>
        </div>

        <div class="section">
            <h2>📊 Métricas de Performance</h2>
            <div class="performance-grid">
                ${generatePerformanceMetrics(reportData.metrics)}
            </div>
        </div>

        <div class="section">
            <h2>📸 Evidências Capturadas</h2>
            ${generateEvidenceSection(reportData.evidence)}
        </div>

        <div class="section">
            <h2>📈 Gráficos de Performance</h2>
            <div class="chart-container">
                <div style="text-align: center;">
                    <h3>Gráfico de Tempos de Execução</h3>
                    <p>Implementar gráficos interativos com Chart.js ou similar</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🔍 Detalhes Técnicos</h2>
            <div class="metric-item">
                <strong>Navegador:</strong> ${reportData.performance?.browser || 'N/A'}<br>
                <strong>Versão:</strong> ${reportData.performance?.version || 'N/A'}<br>
                <strong>Viewport:</strong> ${reportData.metrics[0]?.viewport?.width || 'N/A'}x${reportData.metrics[0]?.viewport?.height || 'N/A'}<br>
                <strong>User Agent:</strong> ${reportData.metrics[0]?.userAgent || 'N/A'}
            </div>
        </div>
    </div>

    <script>
        // Aqui você pode adicionar JavaScript para gráficos interativos
        console.log('Relatório carregado com sucesso!');
    </script>
</body>
</html>`

  return htmlTemplate
}

// Função para gerar seção de métricas de performance
function generatePerformanceMetrics(metrics) {
  if (!metrics || metrics.length === 0) {
    return '<div class="metric-item">Nenhuma métrica disponível</div>'
  }

  return metrics.map(metric => `
    <div class="performance-card">
        <h4>${metric.testName || 'Teste'}</h4>
        <p><strong>Timestamp:</strong> ${new Date(metric.timestamp).toLocaleString('pt-BR')}</p>
        ${metric.performance ? `
        <p><strong>DOM Loading:</strong> ${metric.performance.domLoading}ms</p>
        <p><strong>DOM Content Loaded:</strong> ${metric.performance.domContentLoaded}ms</p>
        <p><strong>Load Complete:</strong> ${metric.performance.loadComplete}ms</p>
        ` : ''}
        ${metric.value ? `<p><strong>Valor:</strong> ${metric.value}${metric.unit || ''}</p>` : ''}
    </div>
  `).join('')
}

// Função para gerar seção de evidências
function generateEvidenceSection(evidence) {
  if (!evidence || evidence.length === 0) {
    return '<div class="evidence-item">Nenhuma evidência disponível</div>'
  }

  return evidence.map(ev => `
    <div class="evidence-item">
        <h4>${ev.step}</h4>
        <p><strong>Timestamp:</strong> ${new Date(ev.timestamp).toLocaleString('pt-BR')}</p>
        <p><strong>URL:</strong> <a href="${ev.url}" target="_blank">${ev.url}</a></p>
        <p><strong>Título:</strong> ${ev.title}</p>
        <p><strong>Elementos:</strong> ${ev.elements.links} links, ${ev.elements.images} imagens, ${ev.elements.forms} formulários</p>
    </div>
  `).join('')
}

// Função principal
function main() {
  try {
    // Lê o relatório JSON
    const reportPath = path.join(__dirname, '..', 'cypress', 'reports', 'detailed-report.json')
    
    if (!fs.existsSync(reportPath)) {
      console.log('❌ Relatório detalhado não encontrado. Execute os testes primeiro.')
      return
    }

    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    
    // Gera relatório HTML
    const htmlReport = generateDetailedHTMLReport(reportData)
    
    // Salva relatório HTML
    const htmlPath = path.join(__dirname, '..', 'cypress', 'reports', 'detailed-report.html')
    fs.writeFileSync(htmlPath, htmlReport)
    
    console.log('✅ Relatório HTML detalhado gerado com sucesso!')
    console.log(`📁 Localização: ${htmlPath}`)
    
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message)
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = { generateDetailedHTMLReport, generatePerformanceMetrics, generateEvidenceSection }
