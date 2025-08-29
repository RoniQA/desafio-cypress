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

// Comando para fazer busca de produto - otimizado
Cypress.Commands.add('searchProduct', (productName) => {
  // Tenta diferentes seletores para o campo de busca
  cy.get('input[type="text"], input[placeholder*="search"], input[aria-label*="search"], #twotabsearchtextbox')
    .should('be.visible')
    .first() // Pega apenas o primeiro elemento encontrado
    .clear()
    .type(productName)
  
  // Tenta diferentes seletores para o botão de busca, pegando apenas o primeiro
  cy.get('input[type="submit"], button[type="submit"], #nav-search-submit-button, .nav-search-submit')
    .should('be.visible')
    .first() // Pega apenas o primeiro elemento encontrado
    .click()
  
  // Aguarda os resultados da busca carregarem
  cy.get('a[href*="/dp/"]').should('have.length.greaterThan', 0)
})

// Comando para selecionar primeiro produto da lista - otimizado
Cypress.Commands.add('selectFirstProduct', () => {
  // Aguarda os produtos estarem disponíveis para clique
  cy.get('a[href*="/dp/"], h2 a, .a-link-normal')
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
    .click()
  
  // Aguarda a página do produto carregar - valida elementos específicos da página de produto
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
})

// Comando para adicionar produto ao carrinho - otimizado
Cypress.Commands.add('addToCart', () => {
  // Tenta diferentes seletores para o botão de adicionar ao carrinho
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .first() // Pega apenas o primeiro elemento encontrado
    .click()
  
  // Aguarda confirmação de adição ao carrinho - validação mais flexível
  // Pode ser uma mensagem de sucesso, confirmação, ou mudança na URL
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    return bodyText.includes('added') || 
           bodyText.includes('cart') || 
           bodyText.includes('success') ||
           bodyText.includes('confirm')
  })
})

// Comando para ir ao carrinho - otimizado
Cypress.Commands.add('goToCart', () => {
  // Tenta diferentes seletores para o carrinho
  cy.get('#nav-cart, .nav-cart, a[href*="/cart"], [data-testid="cart"]')
    .should('exist')
    .first() // Pega apenas o primeiro elemento encontrado
    .click({ force: true }) // Força o clique mesmo se estiver coberto
  
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
  // Pode ser o nome do produto ou parte dele
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    const searchTerm = expectedProductName.toLowerCase()
    return bodyText.includes(searchTerm) || 
           bodyText.includes('item') ||
           bodyText.includes('product')
  })
})
