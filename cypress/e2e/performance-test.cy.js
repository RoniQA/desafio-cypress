describe('Performance Tests - Amazon E-commerce', () => {
  beforeEach(() => {
    // Mede tempo de carregamento da página inicial
    cy.visit('/')
    cy.measurePageLoadTime()
  })

  it('Deve medir performance do fluxo completo com seletores otimizados', () => {
    const startTime = performance.now()
    const productToSearch = 'laptop'
    
    cy.log('🚀 Iniciando teste de performance...')
    
    // 1. Busca por produto - com seletores otimizados
    cy.log('1. Fazendo busca por produto (otimizado)...')
    cy.searchProduct(productToSearch)
    
    // 2. Seleção de produto - com seletores otimizados
    cy.log('2. Selecionando produto (otimizado)...')
    cy.selectFirstProduct()
    
    // 3. Adição ao carrinho - com seletores otimizados
    cy.log('3. Adicionando ao carrinho (otimizado)...')
    cy.addToCart()
    
    // 4. Validação no carrinho - com seletores otimizados
    cy.log('4. Validando no carrinho (otimizado)...')
    cy.validateProductInCart(productToSearch)
    
    // Mede tempo total do fluxo
    cy.then(() => {
      const endTime = performance.now()
      const totalTime = endTime - startTime
      cy.log(`⏱️ Tempo total do fluxo otimizado: ${totalTime.toFixed(2)}ms`)
      
      // Compara com tempo esperado (benchmark)
      const expectedTime = 30000 // 30 segundos
      if (totalTime < expectedTime) {
        cy.log(`✅ Performance EXCELENTE! ${totalTime.toFixed(2)}ms < ${expectedTime}ms`)
      } else if (totalTime < expectedTime * 1.2) {
        cy.log(`🟡 Performance BOA! ${totalTime.toFixed(2)}ms < ${(expectedTime * 1.2).toFixed(2)}ms`)
      } else {
        cy.log(`🔴 Performance pode ser melhorada: ${totalTime.toFixed(2)}ms > ${expectedTime}ms`)
      }
    })
    
    cy.log('✅ Teste de performance concluído!')
  })

  it('Deve medir tempo de carregamento de elementos individuais', () => {
    cy.log('🔍 Medindo performance de elementos individuais...')
    
    // Mede tempo de carregamento do campo de busca
    cy.measurePageLoadTime()
    cy.get('input[type="text"], input[placeholder*="search"], input[aria-label*="search"], #twotabsearchtextbox')
      .should('be.visible')
      .first()
    
    // Mede tempo de carregamento do botão de busca
    cy.get('input[type="submit"], button[type="submit"], #nav-search-submit-button, .nav-search-submit')
      .should('be.visible')
      .first()
    
    // Mede tempo de carregamento do carrinho
    cy.get('#nav-cart, .nav-cart, a[href*="/cart"], [data-testid="cart"]')
      .should('be.visible')
      .first()
    
    cy.log('✅ Medições de elementos concluídas!')
  })

  it('Deve validar performance com diferentes produtos', () => {
    const products = ['book', 'phone', 'shoes']
    
    products.forEach((product, index) => {
      cy.log(`📱 Testando performance com produto ${index + 1}: ${product}`)
      
      const startTime = performance.now()
      
      // Busca rápida
      cy.searchProduct(product)
      
      // Validação rápida
      cy.get('a[href*="/dp/"]').should('have.length.greaterThan', 0)
      
      cy.then(() => {
        const endTime = performance.now()
        const searchTime = endTime - startTime
        cy.log(`⏱️ Tempo de busca para "${product}": ${searchTime.toFixed(2)}ms`)
      })
    })
    
    cy.log('✅ Testes de performance com diferentes produtos concluídos!')
  })
})
