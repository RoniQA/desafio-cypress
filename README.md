# Desafio Cypress - Automação de E-commerce

Este projeto contém testes automatizados usando Cypress para validar o fluxo de ponta a ponta de um cliente em um portal de comércio online (Amazon.com).

## 🎯 Objetivo

Automatizar cenários de teste que cubram o fluxo completo de compra:
1. Acesso ao portal de e-commerce
2. Busca por produto
3. Validação dos resultados da busca
4. Seleção de produto
5. Adição ao carrinho
6. Validação do produto no carrinho

## 🛠️ Tecnologias Utilizadas

- **Cypress**: Framework de automação de testes
- **JavaScript**: Linguagem de programação
- **Node.js**: Runtime environment

## 📁 Estrutura do Projeto

```
desafio-cypress/
├── cypress/
│   ├── e2e/
│   │   └── amazon-e2e.cy.js    # Testes principais
│   └── support/
│       ├── commands.js          # Comandos customizados
│       └── e2e.js              # Configurações de suporte
├── cypress.config.js            # Configuração do Cypress
├── package.json                 # Dependências do projeto
└── README.md                    # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- NPM ou Yarn

### Instalação
```bash
# Instalar dependências
npm install

# Ou usando Yarn
yarn install
```

### Execução dos Testes

#### Modo Interativo (Recomendado para desenvolvimento)
```bash
npm run cypress:open
```

#### Modo Headless (Para CI/CD)
```bash
npm run test
```

#### Modo Headless com interface visual
```bash
npm run test:headed
```

## 🧪 Cenários de Teste

### Cenário Principal (Sucesso)
- **Fluxo Completo**: Busca → Seleção → Adição ao Carrinho → Validação

### Cenários Alternativos
- **Validação de Elementos**: Verificação de elementos essenciais na página inicial
- **Busca Vazia**: Tratamento de busca sem termo de pesquisa

## 📋 Comandos Customizados

O projeto inclui comandos customizados para facilitar a manutenção:

- `waitForPageLoad()`: Aguarda carregamento completo da página
- `searchProduct(productName)`: Realiza busca por produto
- `selectFirstProduct()`: Seleciona primeiro produto da lista
- `addToCart()`: Adiciona produto ao carrinho
- `validateProductInCart(expectedProductName)`: Valida produto no carrinho

## ⚙️ Configurações

- **Base URL**: https://www.amazon.com
- **Viewport**: 1280x720
- **Timeouts**: 10 segundos para comandos e requisições
- **Vídeo**: Habilitado para captura de execução
- **Screenshots**: Capturados automaticamente em caso de falha

## 🔧 Personalização

### Alterar Produto de Teste
No arquivo `cypress/e2e/amazon-e2e.cy.js`, modifique a variável:
```javascript
const productToSearch = 'seu-produto-aqui'
```

### Ajustar Timeouts
No arquivo `cypress.config.js`, modifique os valores de timeout conforme necessário.

## 📊 Relatórios

Os testes geram automaticamente:
- Vídeos de execução (pasta `cypress/videos/`)
- Screenshots de falhas (pasta `cypress/screenshots/`)
- Logs detalhados no console

## 🚨 Tratamento de Erros

- Tratamento de exceções JavaScript não capturadas
- Aguardas inteligentes para elementos da página
- Validações robustas de elementos visíveis

## 🔄 Próximos Passos

Este é o fluxo base. Futuras melhorias podem incluir:
- Mais cenários de teste (sucesso e falha)
- Testes de diferentes categorias de produtos
- Validações de preços e disponibilidade
- Testes de checkout completo
- Integração com Jenkins para CI/CD
- Containerização com Docker
- Relatórios automatizados

## 📝 Notas Importantes

- Os testes são executados contra o site real da Amazon
- Elementos podem mudar, requerendo atualizações nos seletores
- Recomenda-se executar em horários de menor tráfego
- Respeite os termos de uso do site testado

## 🤝 Contribuição

Para contribuir com melhorias:
1. Fork do projeto
2. Criação de branch para feature
3. Implementação das mudanças
4. Testes locais
5. Pull Request com descrição detalhada

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
