window.dataLayer = window.dataLayer || [];

function pushAnalyticsEvent(eventName, payload = {}) {
  window.dataLayer.push({ event: eventName, ...payload });
  console.log('dataLayer push:', { event: eventName, ...payload });
}

function productFromElement(element) {
  if (!element) return null;
  return {
    item_id: element.dataset.productId || '',
    item_name: element.dataset.name || '',
    item_category: element.dataset.category || '',
    price: Number(element.dataset.price || 0),
    quantity: 1
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const productDetail = document.querySelector('main article.product-detail[data-product-id]');
  if (productDetail) {
    const item = productFromElement(productDetail);
    pushAnalyticsEvent('view_item', {
      ecommerce: { currency: 'SEK', value: item.price, items: [item] }
    });
  }

  const searchInput = document.querySelector('#product-search');
  if (searchInput) {
    const cards = [...document.querySelectorAll('article.product-card[data-search]')];
    const resultCount = document.querySelector('#result-count');
    let timer;
    searchInput.addEventListener('input', (event) => {
      const term = event.target.value.trim().toLowerCase();
      let count = 0;
      cards.forEach((card) => {
        const visible = card.dataset.search.toLowerCase().includes(term);
        card.closest('li').hidden = !visible;
        if (visible) count += 1;
      });
      resultCount.textContent = `${count} träff(ar)`;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (term.length > 0) {
          pushAnalyticsEvent('search', { search_term: term, results_count: count });
        }
      }, 400);
    });
  }

  document.querySelectorAll('a.js-product-link[data-product-id]').forEach((link) => {
    link.addEventListener('click', () => {
      const item = {
        item_id: link.dataset.productId,
        item_name: link.dataset.name,
        item_category: link.dataset.category,
        price: Number(link.dataset.price || 0),
        quantity: 1
      };
      pushAnalyticsEvent('select_item', {
        ecommerce: { item_list_name: link.dataset.listName || 'Produktlista', items: [item] }
      });
    });
  });

  const addButton = document.querySelector('main article.product-detail button.js-add-to-cart');
  if (addButton && productDetail) {
    addButton.addEventListener('click', () => {
      const item = productFromElement(productDetail);
      pushAnalyticsEvent('add_to_cart', {
        ecommerce: { currency: 'SEK', value: item.price, items: [item] }
      });
    });
  }
});
