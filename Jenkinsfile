pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        CYPRESS_VERSION = '13.17.0'
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
        
        stage('Run Cypress Tests') {
            steps {
                script {
                    // Executa os testes em modo headless
                    sh 'npm run test'
                }
            }
            post {
                always {
                    // Publica os artefatos do Cypress
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/videos',
                        reportFiles: '*.mp4',
                        reportName: 'Cypress Videos'
                    ])
                    
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/screenshots',
                        reportFiles: '*.png',
                        reportName: 'Cypress Screenshots'
                    ])
                }
            }
        }
        
        stage('Generate Test Report') {
            steps {
                script {
                    // Gera relatório de testes
                    sh 'npm install -g mochawesome-report-generator'
                    sh 'npx cypress run --reporter mochawesome'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'mochawesome-report',
                        reportFiles: 'index.html',
                        reportName: 'Cypress Test Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            // Limpeza
            sh 'rm -rf node_modules'
            sh 'rm -rf cypress/videos'
            sh 'rm -rf cypress/screenshots'
        }
        success {
            echo 'Pipeline executada com sucesso! ✅'
        }
        failure {
            echo 'Pipeline falhou! ❌'
        }
    }
}
