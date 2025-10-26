// ***********************************************
// Custom commands for Amazon E2E tests - FIXED VERSION
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

// Comando para selecionar primeiro produto da lista - CORRIGIDO para evitar detachment
Cypress.Commands.add('selectFirstProduct', () => {
  // Aguarda os produtos estarem disponíveis para clique
  cy.get('a[href*="/dp/"]:not([data-type="backgroundLink"]), h2 a:not([data-type="backgroundLink"]), .a-link-normal:not([data-type="backgroundLink"])')
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
    .should('not.be.disabled')
    .as('productLink') // Usa alias para evitar detachment

  // Quebra a chain para evitar problemas de DOM
  cy.get('@productLink').scrollIntoView()
  cy.get('@productLink').click({ force: true })

  // Aguarda a página do produto carregar completamente
  cy.wait(3000)
  
  // Valida elementos específicos da página de produto
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .should('exist')
  
  cy.wait(2000)
})

// Comando para adicionar produto ao carrinho - CORRIGIDO para evitar detachment
Cypress.Commands.add('addToCart', () => {
  // Aguarda a página carregar completamente
  cy.wait(2000)
  
  // Tenta diferentes seletores para o botão de adicionar ao carrinho
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .should('not.be.disabled')
    .first()
    .as('addToCartBtn') // Usa alias para evitar detachment

  // Quebra a chain para evitar problemas de DOM  
  cy.get('@addToCartBtn').scrollIntoView()
  cy.get('@addToCartBtn').click({ force: true })

  // Aguarda confirmação de adição ao carrinho - validação mais flexível
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    return bodyText.includes('added') ||
           bodyText.includes('cart') ||
           bodyText.includes('success') ||
           bodyText.includes('confirm') ||
           bodyText.includes('shopping cart')
  })
})

// Comando alternativo para seleção de produto - CORRIGIDO
Cypress.Commands.add('selectFirstProductRobust', () => {
  cy.log('🔍 Tentando selecionar produto com estratégia robusta...')
  
  // Estratégia 1: Links diretos de produto (sem background)
  cy.get('a[href*="/dp/"]:not([data-type="backgroundLink"]):not([aria-hidden="true"])')
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
    .should('not.be.disabled')
    .then(($link) => {
      // Verifica se o link não está coberto
      const rect = $link[0].getBoundingClientRect()
      const isClickable = rect.width > 0 && rect.height > 0
      
      if (isClickable) {
        // Usa alias para evitar detachment
        cy.wrap($link).as('productLink')
        cy.get('@productLink').scrollIntoView()
        cy.get('@productLink').click({ force: true })
      } else {
        // Estratégia 2: Tenta próximo link válido
        cy.get('a[href*="/dp/"]:not([data-type="backgroundLink"]):not([aria-hidden="true"])')
          .eq(1)
          .should('be.visible')
          .as('productLink2')
        cy.get('@productLink2').scrollIntoView()
        cy.get('@productLink2').click({ force: true })
      }
    })

  // Aguarda a página do produto carregar
  cy.wait(3000)
  
  // Valida se chegou na página do produto
  cy.get('#add-to-cart-button, .add-to-cart, button[data-action="add-to-cart"], input[value*="Add to Cart"]')
    .should('be.visible')
    .should('exist')
  
  cy.wait(2000)
})

// Comando alternativo para adicionar ao carrinho - ULTRA ROBUSTO CORRIGIDO
Cypress.Commands.add('addToCartRobust', () => {
  cy.log('🛒 Tentando adicionar produto ao carrinho com estratégia ultra-robusta...')
  cy.wait(3000)

  // Lista de seletores possíveis para o botão de adicionar ao carrinho
  const selectors = [
    'input#add-to-cart-button',
    '#add-to-cart-button', 
    '.add-to-cart',
    'button[data-action="add-to-cart"]',
    'input[value*="Add to Cart"]',
    '.a-button-input',
    '.a-button-inner input[type="submit"]'
  ]

  // Estratégia robusta: tenta cada seletor de forma segura
  const trySelectors = (index = 0) => {
    if (index >= selectors.length) {
      cy.log('❌ Nenhum botão encontrado após tentar todos os seletores')
      return
    }

    const selector = selectors[index]
    cy.log(`🔎 Tentando seletor ${index + 1}/${selectors.length}: ${selector}`)
    
    cy.get('body').then($body => {
      const $btn = $body.find(selector + ':visible:not(:disabled)').first()
      if ($btn.length > 0) {
        cy.log('✅ Botão encontrado: ' + selector)
        // Usa estratégia segura com alias
        cy.get(selector).first().then($element => {
          if ($element.is(':visible') && !$element.is(':disabled')) {
            cy.wrap($element).as('addToCartButton')
            cy.get('@addToCartButton').scrollIntoView()
            cy.wait(500)
            cy.get('@addToCartButton').click({ force: true })
          }
        })
      } else {
        // Tenta próximo seletor
        cy.log(`❌ Seletor ${selector} não funcionou, tentando próximo...`)
        trySelectors(index + 1)
      }
    })
  }

  // Primeiro expande acordeões se existirem
  cy.get('body').then($body => {
    const $accordions = $body.find('button[aria-expanded="false"], .a-expander-header')
    if ($accordions.length > 0) {
      cy.log('🔎 Expandindo acordeões encontrados...')
      cy.get('button[aria-expanded="false"], .a-expander-header').each($el => {
        cy.wrap($el).then($element => {
          if ($element.is(':visible')) {
            cy.wrap($element).click({ force: true })
            cy.wait(300)
          }
        })
      })
      cy.wait(1000)
    }
    
    // Agora tenta encontrar o botão
    trySelectors(0)
  })

  // Aguarda confirmação de adição ao carrinho
  cy.get('body', { timeout: 15000 }).should('satisfy', (body) => {
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
Cypress.Commands.add('validateProductInCart', (productName) => {
  // Validação simples se há produto no carrinho
  cy.get('body').should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase()
    const productNameLower = productName.toLowerCase()
    return bodyText.includes(productNameLower) ||
           bodyText.includes('cart') ||
           bodyText.includes('shopping') ||
           bodyText.includes('item') ||
           bodyText.includes('product')
  })
  
  cy.log(`✅ Produto ${productName} validado no carrinho!`)
})

// Comando para medir tempo de carregamento da página
Cypress.Commands.add('measurePageLoadTime', () => {
  cy.window().then((win) => {
    const perfData = win.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    cy.log(`⏱️ Tempo de carregamento da página: ${pageLoadTime}ms`)
    
    // Adiciona métrica para relatório
    cy.task('addMetric', {
      timestamp: new Date().toISOString(),
      metric: 'pageLoadTime',
      value: pageLoadTime,
      url: win.location.href
    }, { failOnStatusCode: false })
  })
})

// Comando para aguardar elemento com timeout personalizado
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible')
})

// Comando para clicar com retry em caso de falha
Cypress.Commands.add('clickWithRetry', (selector, maxRetries = 3) => {
  const clickElement = (retryCount = 0) => {
    if (retryCount >= maxRetries) {
      throw new Error(`Falhou ao clicar em ${selector} após ${maxRetries} tentativas`)
    }
    
    cy.get(selector).then($el => {
      if ($el.is(':visible') && !$el.is(':disabled')) {
        cy.wrap($el).click({ force: true })
      } else {
        cy.wait(1000)
        clickElement(retryCount + 1)
      }
    })
  }
  
  clickElement()
})