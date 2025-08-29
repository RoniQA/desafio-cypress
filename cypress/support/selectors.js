// Seletores Otimizados para Performance
// Prioridade: ID > Data Attributes > Classes específicas > Classes genéricas

export const SELECTORS = {
  // Campo de Busca - Prioridade alta (ID)
  SEARCH_INPUT: '#twotabsearchtextbox',
  SEARCH_BUTTON: '#nav-search-submit-button',
  
  // Resultados de Busca - Prioridade alta (Data attributes)
  SEARCH_RESULTS: '[data-component-type="s-search-result"]',
  PRODUCT_LINKS: 'a[href*="/dp/"]',
  
  // Página do Produto - Prioridade alta (ID)
  ADD_TO_CART_BUTTON: '#add-to-cart-button',
  PRODUCT_TITLE: '#productTitle',
  
  // Carrinho - Prioridade alta (ID)
  CART_ICON: '#nav-cart',
  
  // Fallbacks para diferentes versões da página
  SEARCH_INPUT_FALLBACK: 'input[type="text"][placeholder*="search"]',
  SEARCH_BUTTON_FALLBACK: 'input[type="submit"], button[type="submit"]',
  PRODUCT_LINKS_FALLBACK: 'h2 a, .a-link-normal',
  ADD_TO_CART_FALLBACK: '.add-to-cart, button[data-action="add-to-cart"]',
  CART_FALLBACK: 'a[href*="/cart"], [data-testid="cart"]'
}

// Função para seletores otimizados com fallbacks
export const getOptimizedSelector = (primarySelector, fallbackSelectors) => {
  return `${primarySelector}, ${fallbackSelectors.join(', ')}`
}

// Seletores específicos para performance
export const PERFORMANCE_SELECTORS = {
  // Seletores mais rápidos (ID e data attributes)
  FAST: {
    SEARCH: '#twotabsearchtextbox',
    RESULTS: '[data-component-type="s-search-result"]',
    PRODUCT: 'a[href*="/dp/"]',
    CART_BUTTON: '#add-to-cart-button',
    CART_ICON: '#nav-cart'
  },
  
  // Seletores de fallback (classes e atributos)
  FALLBACK: {
    SEARCH: 'input[type="text"]',
    RESULTS: '.s-result-item',
    PRODUCT: 'h2 a',
    CART_BUTTON: '.add-to-cart',
    CART_ICON: '.nav-cart'
  }
}
