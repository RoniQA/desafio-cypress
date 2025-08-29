

describe('Amazon E-commerce - Fluxo de Ponta a Ponta', () => {
  beforeEach(() => {
    // Visita a página inicial da Amazon antes de cada teste
    cy.visit('/')
    // Aguarda apenas o body estar visível, sem wait fixo
    cy.get('body').should('be.visible')
  })

  it('Deve completar fluxo completo de compra: busca, seleção e adição ao carrinho', () => {
    const productToSearch = 'laptop'
    
    // 1. Fazer busca por produto
    cy.log('1. Fazendo busca por produto...')
    cy.searchProduct(productToSearch)
    
    // 2. Validar retorno da busca - verifica se há produtos listados
    cy.log('2. Validando resultados da busca...')
    cy.get('a[href*="/dp/"]').should('have.length.greaterThan', 0)
    
    // 3. Selecionar primeiro produto da lista
    cy.log('3. Selecionando produto da lista...')
    cy.selectFirstProductRobust()
    
    // 4. Validar página do produto
    cy.log('4. Validando página do produto...')
    cy.get('body').should('contain', productToSearch)
    
    // 5. Adicionar produto ao carrinho
    cy.log('5. Adicionando produto ao carrinho...')
    cy.addToCartRobust()
    
    // 6. Validar produto no carrinho
    cy.log('6. Validando produto no carrinho...')
    cy.validateProductInCart(productToSearch)
    
    cy.log('✅ Fluxo completo executado com sucesso!')
  })

  it('Deve validar elementos essenciais da página inicial', () => {
    // Validar elementos principais da página inicial
    cy.get('body').should('be.visible')
    
    // Verifica se há algum campo de busca
    cy.get('input[type="text"], input[placeholder*="search"], input[aria-label*="search"]')
      .should('be.visible')
    
    // Verifica se há algum botão de busca
    cy.get('input[type="submit"], button[type="submit"]')
      .should('be.visible')
    
    // Verifica se há algum link para o carrinho
    cy.get('a[href*="/cart"], [data-testid="cart"], .nav-cart')
      .should('be.visible')
  })

  it('Deve mostrar resultados para busca válida', () => {
    const productToSearch = 'book'
    
    // Fazer busca por produto
    cy.searchProduct(productToSearch)
    
    // Validar que há resultados
    cy.get('body').should('contain', productToSearch)
    
    // Verificar se há produtos listados (usando seletor mais simples)
    cy.get('a[href*="/dp/"]').should('have.length.greaterThan', 0)
  })
})
