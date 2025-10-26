# 🤖 Instruções Rápidas para o GitHub Copilot

## 📋 Resumo dos Erros

Foram identificados **5 problemas** na execução dos testes Cypress:

| # | Problema | Severidade | Arquivo Afetado |
|---|----------|------------|-----------------|
| 1 | Cypress não consegue fazer download | ⛔ CRÍTICO | Todos workflows |
| 2 | Allure CLI não instalado | 🔴 ALTO | cypress-parallel.yml |
| 3 | Scripts de relatório sem tratamento de erro | 🟡 MÉDIO | generate-report.js |
| 4 | Uso incorreto de job.status | 🟡 MÉDIO | cypress-tests.yml |
| 5 | Comentário inválido em JSON | 🟢 BAIXO | combine-reports.js |

---

## 🚀 Correção Rápida - Copie e Cole

### Prompt 1: Corrigir Problema Crítico do Cypress

```
@workspace Corrija o erro de download do Cypress nos workflows do GitHub Actions:

1. Em TODOS os arquivos .github/workflows/*.yml, adicione este step ANTES dos testes Cypress:

```yaml
- name: Verify Cypress Installation
  run: |
    npx cypress install --force
    npx cypress verify
  continue-on-error: false
```

2. Se estiver usando npm ci, adicione a variável de ambiente CYPRESS_INSTALL_BINARY:

```yaml
- name: Install Dependencies
  run: npm ci
  env:
    CYPRESS_INSTALL_BINARY: 0
```

3. Certifique-se de que o step "Verify Cypress Installation" vem depois de "Install Dependencies" e antes de qualquer execução do Cypress.

Aplique em:
- .github/workflows/cypress-tests.yml
- .github/workflows/cypress-pr.yml
- .github/workflows/cypress-parallel.yml
```

---

### Prompt 2: Corrigir Allure Reports

```
@workspace Corrija o problema dos relatórios Allure:

OPÇÃO A - Instalar Allure (se quiser usar):
1. Adicione ao package.json devDependencies: "allure-commandline": "^2.24.0"
2. Execute: npm install

OPÇÃO B - Remover Allure (recomendado se não for usar):
1. No arquivo .github/workflows/cypress-parallel.yml, REMOVA ou COMENTE os seguintes steps:
   - "Generate Allure Report (Functional)" (linhas ~48-51)
   - "Upload Allure Report (Functional)" (linhas ~53-58)
   - "Generate Allure Report (Performance)" (linhas ~68-71)
   - "Upload Allure Report (Performance)" (linhas ~73-78)

Escolha a OPÇÃO B (remover) para correção rápida.
```

---

### Prompt 3: Melhorar Tratamento de Erros

```
@workspace Melhore o tratamento de erros nos scripts de relatório:

1. No arquivo scripts/generate-report.js, atualize a função main() para:

```javascript
function main() {
  try {
    const reportPath = path.join(__dirname, '..', 'cypress', 'reports', 'detailed-report.json')
    
    if (!fs.existsSync(reportPath)) {
      console.log('ℹ️ Relatório detalhado não encontrado. Criando relatório padrão...')
      const defaultReport = {
        timestamp: new Date().toISOString(),
        metrics: [],
        evidence: [],
        summary: { totalMetrics: 0, totalEvidence: 0, testDuration: 0 },
        performance: { totalDuration: 0, browser: 'N/A', version: 'N/A' }
      }
      const reportData = defaultReport
      const htmlReport = generateDetailedHTMLReport(reportData)
      const htmlPath = path.join(__dirname, '..', 'cypress', 'reports', 'detailed-report.html')
      fs.writeFileSync(htmlPath, htmlReport)
      console.log('✅ Relatório HTML padrão gerado!')
      return
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    const htmlReport = generateDetailedHTMLReport(reportData)
    const htmlPath = path.join(__dirname, '..', 'cypress', 'reports', 'detailed-report.html')
    fs.writeFileSync(htmlPath, htmlReport)
    console.log('✅ Relatório HTML detalhado gerado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message)
    process.exit(0)  // Exit com sucesso para não falhar workflow
  }
}
```

2. No arquivo .github/workflows/cypress-tests.yml, adicione continue-on-error aos steps de relatório:

```yaml
- name: Generate Detailed Reports
  if: always()
  continue-on-error: true
  run: |
    node scripts/combine-reports.js || echo "Relatório combinado não gerado"
    node scripts/generate-report.js || echo "Relatório detalhado não gerado"
```
```

---

### Prompt 4: Corrigir Condicionais do Workflow

```
@workspace Corrija o uso incorreto de job.status no arquivo .github/workflows/cypress-tests.yml:

1. Encontre e REMOVA as linhas que usam "${{ job.status }}" (aproximadamente linhas 72 e 80)

2. SUBSTITUA o step "Generate Detailed Reports" por:

```yaml
- name: Generate Detailed Reports
  if: always()
  continue-on-error: true
  run: |
    echo "🚀 Gerando relatórios detalhados..."
    mkdir -p cypress/reports
    node scripts/combine-reports.js || echo "⚠️ Relatório combinado não gerado"
    node scripts/generate-report.js || echo "⚠️ Relatório HTML não gerado"
```

3. No job "notify" (linhas ~162-181), certifique-se de que está usando:
   - needs.cypress-run.result == 'success' (em vez de job.status)
   - needs.performance-tests.result == 'success' ou 'skipped'
```

---

### Prompt 5: Limpar Código JSON

```
@workspace Remova o comentário inválido do arquivo scripts/combine-reports.js:

Na linha 84, dentro do objeto artifacts, REMOVA esta linha:
  // mochawesome: 'mochawesome-report/',

OU descomente se quiser usar:
  "mochawesome": "mochawesome-report/",

O objeto artifacts deve ficar assim:

```javascript
"artifacts": {
  "screenshots": "cypress/screenshots/",
  "videos": "cypress/videos/",
  "detailed": "cypress/reports/"
}
```
```

---

## ⚡ Correção Ultra-Rápida (Um Comando)

Se quiser corrigir TODOS os problemas de uma vez:

```
@workspace Corrija TODOS os problemas identificados no arquivo ERROR_ANALYSIS.md:

1. Adicione verificação do Cypress em todos workflows antes dos testes
2. Remova steps de Allure do cypress-parallel.yml
3. Adicione tratamento de erro robusto em generate-report.js
4. Corrija condicionais de job.status para usar success() ou always()
5. Remova comentário inválido da linha 84 de combine-reports.js
6. Adicione continue-on-error: true em todos os steps de geração de relatório

Priorize as correções na ordem:
- CRÍTICO: Cypress download
- ALTO: Allure (remover)
- MÉDIO: Tratamento de erros
- BAIXO: Limpeza de código

Certifique-se de não quebrar funcionalidade existente.
```

---

## ✅ Validação Rápida

Após aplicar as correções, execute:

```bash
# Verificar instalação
npm ci
npx cypress verify

# Testar localmente
npm run test:fast

# Verificar scripts
node scripts/combine-reports.js
node scripts/generate-report.js
```

---

## 📊 Status das Correções

Marque conforme for aplicando:

- [ ] Problema 1: Cypress download ⛔
- [ ] Problema 2: Allure reports 🔴
- [ ] Problema 3: Tratamento de erros 🟡
- [ ] Problema 4: Job status 🟡
- [ ] Problema 5: Comentário JSON 🟢

---

## 🆘 Se Algo Não Funcionar

1. Verifique logs do GitHub Actions
2. Execute `npm ci` novamente localmente
3. Limpe cache: `npm run cache:clear`
4. Reinstale: `rm -rf node_modules && npm install`
5. Consulte o arquivo ERROR_ANALYSIS.md para detalhes completos

---

**Para detalhes completos e explicações técnicas, veja: ERROR_ANALYSIS.md**
