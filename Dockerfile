# Dockerfile para execução dos testes Cypress
FROM cypress/included:13.17.0

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY cypress.config.js ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Expõe a porta padrão do Cypress (se necessário)
EXPOSE 8080

# Comando padrão para executar os testes
CMD ["npm", "run", "test"]
