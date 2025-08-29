pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        CYPRESS_VERSION = '13.17.0'
        PARALLEL_JOBS = 3
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Instala Node.js
                    sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
                    sh 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install $NODE_VERSION && nvm use $NODE_VERSION'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Cache Management') {
            steps {
                script {
                    // Lista cache atual
                    sh 'npm run cache:list'
                    
                    // Limpa cache antigo se necessário
                    sh 'npm run cache:prune'
                }
            }
        }
        
        stage('Run Cypress Tests - Performance Mode') {
            parallel {
                stage('Test Suite 1 - Fluxo Principal') {
                    steps {
                        sh 'npm run test:performance'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'cypress/screenshots',
                                reportFiles: '*.png',
                                reportName: 'Performance Test Results'
                            ])
                        }
                    }
                }
                
                stage('Test Suite 2 - Performance Tests') {
                    steps {
                        sh 'npm run test:performance -- --spec "cypress/e2e/performance-test.cy.js"'
                    }
                }
                
                stage('Test Suite 3 - Fast Mode') {
                    steps {
                        sh 'npm run test:fast'
                    }
                }
            }
        }
        
        stage('Performance Benchmark') {
            steps {
                script {
                    // Executa benchmark de performance
                    sh 'npm run test:benchmark'
                }
            }
        }
        
        stage('Generate Performance Report') {
            steps {
                script {
                    // Gera relatório de performance
                    sh 'echo "Performance Report Generated" > performance-report.txt'
                    sh 'echo "Date: $(date)" >> performance-report.txt'
                    sh 'echo "Total Execution Time: $(cat cypress/results/*.json | jq -r \'.runs[].stats.duration\')" >> performance-report.txt'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'performance-report.txt',
                        reportName: 'Performance Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            // Limpeza e cache
            sh 'rm -rf node_modules'
            sh 'npm run cache:clear'
            
            // Arquivos de performance
            archiveArtifacts artifacts: 'performance-report.txt', fingerprint: true
        }
        success {
            echo '🚀 Pipeline de Performance executada com sucesso! ✅'
            echo '📊 Resultados de Performance disponíveis nos artefatos'
        }
        failure {
            echo '❌ Pipeline de Performance falhou!'
        }
    }
}
