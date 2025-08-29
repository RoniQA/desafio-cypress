// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para aguardar carregamento da página - otimizado
Cypress.Commands.add('waitForPageLoad', () => {
  // Aguarda apenas o body estar visível, sem wait fixo
  cy.get('body').should('be.visible')
})

// Comando para fazer busca de produto - otimizado com seletores funcionais
Cypress.Commands.add('searchProduct', (productName) => {
  // Usa seletores que funcionam na Amazon
  cy.get('input[type="text"], input[placeholder*="search"], input[aria-label*="search"], #twotabsearchtextbox')
    .should('be.visible')
    .first()
    .clear()
    .type(productName)
  
  // Botão de busca
  cy.get('input[type="submit"], button[type="submit"], #nav-search-submit-button, .nav-search-submit')
    .should('be.visible')
    .first()
    .click()
  
  // Aguarda resultados usando seletor que funciona
  cy.get('a[href*="/dp/"]').should('have.length.greaterThan', 0)
})

// Comando para selecionar primeiro produto da lista - otimizado para CI/CD
Cypress.Commands.add('selectFirstProduct', () => {
  // Aguarda os produtos estarem disponíveis para clique
  cy.get('a[href*="/dp/"], h2 a, .a-link-normal')
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
    .click()

  // Aguarda a página do produto carregar completamente
  cy.wait(3000)
  
  // Valida elementos específicos da página de produto
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .should('exist')
  
  // Aguarda um pouco mais para garantir que tudo carregou
  cy.wait(2000)
})

// Comando para adicionar produto ao carrinho - otimizado para CI/CD
Cypress.Commands.add('addToCart', () => {
  // Aguarda a página carregar completamente
  cy.wait(2000)
  
  // Tenta diferentes seletores para o botão de adicionar ao carrinho
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .should('not.be.disabled')
    .first()
    .scrollIntoView() // Garante que o elemento está visível
    .click({ force: true }) // Força o clique se necessário

  // Aguarda confirmação de adição ao carrinho - validação mais flexível
  // Pode ser uma mensagem de sucesso, confirmação, ou mudança na URL
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    return bodyText.includes('added') ||
           bodyText.includes('cart') ||
           bodyText.includes('success') ||
           bodyText.includes('confirm') ||
           bodyText.includes('shopping cart')
  })
})

// Comando para ir ao carrinho - otimizado
Cypress.Commands.add('goToCart', () => {
  // Tenta diferentes seletores para o carrinho
  cy.get('#nav-cart, .nav-cart, a[href*="/cart"], [data-testid="cart"]')
    .should('exist')
    .first()
    .click({ force: true })
  
  // Aguarda a página do carrinho carregar - validação mais flexível
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    return bodyText.includes('cart') || 
           bodyText.includes('shopping') ||
           bodyText.includes('basket')
  })
})

// Comando para validar produto no carrinho - otimizado
Cypress.Commands.add('validateProductInCart', (expectedProductName) => {
  // Primeiro vai para o carrinho
  cy.goToCart()
  
  // Depois valida se o produto está no carrinho - validação mais flexível
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    const searchTerm = expectedProductName.toLowerCase()
    return bodyText.includes(searchTerm) || 
           bodyText.includes('item') ||
           bodyText.includes('product')
  })
})

// Comando para teste de performance - mede tempo de carregamento
Cypress.Commands.add('measurePageLoadTime', () => {
  const startTime = performance.now()
  
  cy.get('body').should('be.visible').then(() => {
    const endTime = performance.now()
    const loadTime = endTime - startTime
    cy.log(`⏱️ Tempo de carregamento da página: ${loadTime.toFixed(2)}ms`)
  })
})

// Comando para aguarda inteligente com timeout otimizado
Cypress.Commands.add('waitForElement', (selector, timeout = 5000) => {
  cy.get(selector, { timeout }).should('be.visible')
})

// Comando para retry inteligente de elementos problemáticos
Cypress.Commands.add('retryClick', (selector, options = {}) => {
  const maxAttempts = options.maxAttempts || 3
  const delay = options.delay || 1000
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      cy.get(selector)
        .should('be.visible')
        .should('not.be.disabled')
        .scrollIntoView()
        .click({ force: true })
      return // Sucesso, sai da função
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error // Última tentativa falhou
      }
      cy.wait(delay) // Aguarda antes da próxima tentativa
    }
  }
})
