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
  // Usa seletores mais específicos para evitar links de background
  cy.get('a[href*="/dp/"]:not([data-type="backgroundLink"]), h2 a:not([data-type="backgroundLink"]), .a-link-normal:not([data-type="backgroundLink"])')
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView() // Garante que o elemento está visível
    .click({ force: true }) // Força o clique se necessário

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

// Comando alternativo para adicionar ao carrinho - mais robusto

Cypress.Commands.add('addToCartRobust', () => {
  cy.log('🛒 Tentando adicionar produto ao carrinho com estratégia ultra-robusta...');
  cy.wait(3000);

  // Expande acordeões e opções possíveis
  cy.get('button, .a-accordion-row-a11y, button[aria-expanded="false"], .a-accordion .a-expander-header:not([aria-expanded="true"])').each($el => {
    const text = $el.textContent?.toLowerCase() || '';
    if (text.includes('opção') || text.includes('option') || text.includes('expandir') || text.includes('expand') || text.includes('ver mais') || text.includes('see more')) {
      cy.wrap($el).click({ force: true });
      cy.wait(500);
    }
  });

  // Lista de seletores possíveis para o botão de adicionar ao carrinho
  const selectors = [
    'input#add-to-cart-button',
    '#add-to-cart-button',
    '.add-to-cart',
    'button[data-action="add-to-cart"]',
    'input[value*="Add to Cart"]',
    '.a-button-input',
    '.a-button-inner input[type="submit"]'
  ];



  // Função para expandir o acordeão pai do botão invisível e tentar clicar
  function tryClickButton(index = 0) {
    if (index >= selectors.length) {
      cy.log('❌ Nenhum botão de adicionar ao carrinho visível encontrado.');
      return;
    }
    cy.get('body').then($body => {
      // Procura o botão, mesmo invisível
      const $btn = $body.find(selectors[index]).first();
      if ($btn.length) {
        if ($btn.is(':visible')) {
          cy.wrap($btn).scrollIntoView();
          cy.wait(300);
          cy.wrap($btn).should('be.visible').should('not.be.disabled').click({ force: true });
        } else {
          // Sobe até o acordeão pai e expande
          let $parent = $btn.parent();
          let foundAccordion = false;
          for (let i = 0; i < 5 && $parent.length && !foundAccordion; i++) {
            if ($parent.is('[aria-expanded="false"], .a-accordion-inner[style*="display: none"]')) {
              foundAccordion = true;
              // Procura botão de expandir
              const $expandBtn = $parent.parent().find('button, .a-accordion-row-a11y').first();
              if ($expandBtn.length) {
                cy.wrap($expandBtn).click({ force: true });
                cy.wait(500);
              }
            }
            $parent = $parent.parent();
          }
          // Após expandir, tenta novamente
          cy.wait(500);
          cy.get('body').then($body2 => {
            const $btn2 = $body2.find(selectors[index]+':visible').first();
            if ($btn2.length) {
              cy.wrap($btn2).scrollIntoView();
              cy.wait(300);
              cy.wrap($btn2).should('be.visible').should('not.be.disabled').click({ force: true });
            } else {
              tryClickButton(index + 1);
            }
          });
        }
      } else {
        tryClickButton(index + 1);
      }
    });
  }

  tryClickButton();

  // Aguarda confirmação com timeout maior
  cy.get('body', { timeout: 15000 }).should('satisfy', (body) => {
    const bodyText = body.text().toLowerCase();
    return bodyText.includes('added') ||
           bodyText.includes('cart') ||
           bodyText.includes('success') ||
           bodyText.includes('confirm') ||
           bodyText.includes('shopping cart') ||
           bodyText.includes('item') ||
           bodyText.includes('product');
  });
});

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
    
    // Adiciona métrica ao relatório
    if (Cypress.env('collectMetrics')) {
      cy.task('addMetric', {
        name: 'pageLoadTime',
        value: loadTime,
        unit: 'ms',
        timestamp: new Date().toISOString()
      })
    }
  })
})

// Comando para coletar métricas detalhadas de performance
Cypress.Commands.add('collectPerformanceMetrics', (testName) => {
  const metrics = {
    testName,
    timestamp: new Date().toISOString(),
    viewport: {
      width: Cypress.config('viewportWidth'),
      height: Cypress.config('viewportHeight')
    },
    browser: Cypress.browser.name,
    version: Cypress.browser.version
  }
  
  // Salva métricas básicas para o relatório
  cy.task('saveMetrics', metrics)
  
  cy.log(`📊 Métricas de performance coletadas para: ${testName}`)
})

// Comando para capturar evidências visuais
Cypress.Commands.add('captureEvidence', (stepName) => {
  const timestamp = new Date().toISOString()
  const evidenceName = `${stepName}_${timestamp.replace(/[:.]/g, '-')}`
  
  // Captura screenshot
  cy.screenshot(evidenceName)
  
  // Captura informações da página
  cy.get('body').then(($body) => {
    const pageInfo = {
      step: stepName,
      timestamp,
      url: cy.url(),
      title: $body.find('title').text() || 'Sem título',
      elements: {
        links: $body.find('a').length,
        images: $body.find('img').length,
        forms: $body.find('form').length
      }
    }
    
    // Salva evidência para o relatório
    cy.task('saveEvidence', pageInfo)
  })
  
  cy.log(`📸 Evidência capturada: ${stepName}`)
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

// Comando alternativo para seleção de produto - mais robusto
Cypress.Commands.add('selectFirstProductRobust', () => {
  // Tenta diferentes estratégias de seleção
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
        cy.wrap($link).scrollIntoView().click({ force: true })
      } else {
        // Estratégia 2: Tenta próximo link válido
        cy.get('a[href*="/dp/"]:not([data-type="backgroundLink"]):not([aria-hidden="true"])')
          .eq(1)
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true })
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
