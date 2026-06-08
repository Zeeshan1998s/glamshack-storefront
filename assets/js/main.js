    // Keep track of navigation history stack for back button support
    let navigationHistory = ['view-home'];
    let activeShopFilter = 'all';
    let activeTrousseauFilter = 'all';
    let headerSearchQuery = '';

    // Mock articles database for the Glamshack Journal
    const ARTICLES_DB = {
      platter: {
        title: "The Art of Curating the Perfect Engagement Platter",
        category: "Bespoke Gifting",
        date: "June 08, 2026",
        author: "By Evelyn Rose",
        img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&auto=format&fit=crop",
        body: `
          <p><span class="dropcap">E</span>ngagement platters are the visual highlight of a modern traditional wedding. Curating the perfect platter is not simply about stacking gifts—it is an exercise in symmetry, materials, and aesthetic storytelling.</p>
          <p>Start by selecting a luxury theme. Deep charcoal tray bases combined with gold-trimmed borders provide a striking modern contrast. Lay a soft velvet lining inside to protect the gifts and give the presentation a textured, premium weight. Arrange the primary elements (like rings or jewelry cases) in the center, and frame them with smaller accessories or fresh floral accents.</p>
          <p>Color coordination is critical. Match the box wraps and ribbon details to the wedding attire. At Glamshack, our platters combine handcrafted zardosi embroidery with modern polished borders, creating an unboxing experience that feels like a ceremony in itself.</p>
        `
      },
      beauty: {
        title: "Cruelty-Free Ingredients: Why Luxury is Going Clean",
        category: "Clean Beauty",
        date: "May 24, 2026",
        author: "By Dr. Sarah Sterling",
        img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop",
        body: `
          <p><span class="dropcap">L</span>uxury beauty is undergoing a massive revolution. Today's consumer does not want to choose between high-pigment performance and conscious, cruelty-free vegan ingredients. The modern luxury market demands both.</p>
          <p>Eliminating animal testing and synthetic chemicals from premium formulas actually opens up a world of rich, nourishing plant-based alternatives. Botanical oils, natural mineral pigments, and organic rose extracts deliver deep skin nourishment alongside flawless cosmetic presentation.</p>
          <p>Glamshack products are formulated with 100% vegan, clean botanical complexes. Combined with zero-waste metal compacts and refillable glass packaging, we ensure that conscious beauty remains a premium sensory delight.</p>
        `
      },
      trends: {
        title: "Saree Box Trends for the Modern Trousseau",
        category: "Wedding Trends",
        date: "April 12, 2026",
        author: "By Kabir Hanif",
        img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop",
        body: `
          <p><span class="dropcap">T</span>he wedding trousseau packaging is undergoing a modern transformation. Traditionally plain, today's saree boxes are fashion statements in their own right, combining rich fabrics, custom monogramming, and structural durability.</p>
          <p>This season, we are seeing a shift away from overly bright reds toward subtle, sophisticated colors. Royal lilac, soft jade, and midnight mirage are popular pastel and deep palettes. Adding customized gold foil monograms or custom Zardosi borders makes the boxes highly personal keepsakes.</p>
          <p>Our hand-built saree boxes utilize heavy sustainable chipboard bases lined with raw silk and velvet, ensuring that the garments are preserved beautifully for years to come.</p>
        `
      }
    };

    // Navigates between SPA page views
    function navigateTo(viewId) {
      // Hide all page views
      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active-view');
      });

      // Show target view
      const targetView = document.getElementById(viewId);
      if (targetView) {
        targetView.classList.add('active-view');
        
        // Track history if it's different from the current page
        if (navigationHistory[navigationHistory.length - 1] !== viewId) {
          navigationHistory.push(viewId);
        }
      }

      // Update active state in nav link buttons
      document.querySelectorAll('.cat-nav-link').forEach(link => {
        link.classList.remove('active');
      });

      // Scroll window to top
      window.scrollTo(0, 0);
    }

    // Handles clicking a product card to open the PDP full view
    function openProductPage(event) {
      // Update PDP context to load clicked product data (supports both update and updateContext)
      const pdpContext = document.getElementById('pdp-context');
      if (pdpContext) {
        if (typeof pdpContext.update === 'function') {
          pdpContext.update(event);
        } else if (typeof pdpContext.updateContext === 'function') {
          pdpContext.updateContext(event);
        }
      }

      // Navigate to dedicated PDP view
      navigateTo('view-product');
    }

    // Back navigation resolver
    function navigateBack() {
      if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remove current view
        const previousView = navigationHistory[navigationHistory.length - 1];
        navigateTo(previousView);
      } else {
        navigateTo('view-home');
      }
    }

    // Navigates to shop and triggers category filtering
    function handleCategoryNav(category) {
      navigateTo('view-shop');
      filterShopProducts(category);
    }

    // Handles dynamic filtering of products on the Shop page client-side
    function filterShopProducts(category) {
      activeShopFilter = category;

      // Toggle active states on collection tabs
      document.querySelectorAll('.btn-tab').forEach(tab => {
        tab.classList.remove('active-tab');
      });
      const activeTab = document.getElementById('tab-' + category);
      if (activeTab) {
        activeTab.classList.add('active-tab');
      }

      // Toggle active states on main navigation links
      document.querySelectorAll('.cat-nav-link').forEach(link => {
        if (link.getAttribute('onclick') === `handleCategoryNav('${category}')`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      applyProductFilter();
    }

    // Apply the active filter and search query to currently rendered cards
    function applyProductFilter() {
      const cards = document.querySelectorAll('#view-shop .glam-card');
      const emptyState = document.getElementById('shop-empty-state');
      if (cards.length === 0) return;

      let matchCount = 0;

      cards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();
        
        let matchesCategory = false;
        if (activeShopFilter === 'all') {
          matchesCategory = true;
        } else if (activeShopFilter === 'hampers') {
          matchesCategory = title.includes('hamper');
        } else if (activeShopFilter === 'trays') {
          matchesCategory = title.includes('tray') || title.includes('platter');
        } else if (activeShopFilter === 'saree-covers') {
          matchesCategory = title.includes('saree') || title.includes('cover') || title.includes('suit');
        } else if (activeShopFilter === 'bags') {
          matchesCategory = title.includes('bag') || title.includes('potli') || title.includes('envelope') || title.includes('clutch');
        } else if (activeShopFilter === 'baskets') {
          matchesCategory = title.includes('basket') || title.includes('trunk') || title.includes('box') || title.includes('baksa');
        } else if (activeShopFilter === 'pouches') {
          matchesCategory = title.includes('pouch') || title.includes('organizer');
        } else if (activeShopFilter === 'bands') {
          matchesCategory = title.includes('band') || title.includes('bangle') || title.includes('necklace') || title.includes('set') || title.includes('earring') || title.includes('choker') || title.includes('pendant');
        }
        
        const matchesSearch = title.includes(headerSearchQuery.toLowerCase());
        
        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        if (matchCount === 0) {
          emptyState.style.display = 'flex';
        } else {
          emptyState.style.display = 'none';
        }
      }
    }

    // Custom Search Drawer Sidebar Operations
    function openSearchDrawer() {
      const drawer = document.getElementById('search-drawer');
      const overlay = document.getElementById('search-drawer-overlay');
      const input = document.getElementById('search-drawer-input');
      if (!drawer || !input) return;
      
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
      setTimeout(() => input.focus(), 150);
      
      // Load initial suggestions / featured items
      handleDrawerSearch('');
    }

    function closeSearchDrawer() {
      const drawer = document.getElementById('search-drawer');
      const overlay = document.getElementById('search-drawer-overlay');
      const input = document.getElementById('search-drawer-input');
      if (!drawer) return;
      
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = ''; // Restore background scrolling
      if (input) {
        input.value = '';
      }
      clearDrawerSearch();
    }

    function clearDrawerSearch() {
      const input = document.getElementById('search-drawer-input');
      const clearBtn = document.getElementById('search-drawer-clear-btn');
      if (input) input.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      handleDrawerSearch('');
    }

    function executeSearch(query) {
      if (!query || query.trim() === '') {
        headerSearchQuery = '';
        const wrapper = document.getElementById('search-title-wrapper');
        const defaultHeader = document.getElementById('shop-default-header');
        if (wrapper) wrapper.style.display = 'none';
        if (defaultHeader) defaultHeader.style.display = 'block';
      } else {
        headerSearchQuery = query.trim();
        const wrapper = document.getElementById('search-title-wrapper');
        const defaultHeader = document.getElementById('shop-default-header');
        const titleEl = document.getElementById('shop-search-title');
        if (wrapper) wrapper.style.display = 'block';
        if (defaultHeader) defaultHeader.style.display = 'none';
        if (titleEl) titleEl.textContent = headerSearchQuery;
      }
      closeSearchDrawer();
      handleCategoryNav('all');
    }

    function handleDrawerSearch(query) {
      const clearBtn = document.getElementById('search-drawer-clear-btn');
      if (clearBtn) {
        clearBtn.style.display = query.trim() !== '' ? 'block' : 'none';
      }

      const statusEl = document.getElementById('search-drawer-status');
      const resultsContainer = document.getElementById('search-drawer-results');
      const defaultContainer = document.getElementById('search-drawer-default');
      if (!resultsContainer || !defaultContainer) return;

      const trimmedQuery = query.trim().toLowerCase();
      const allProducts = getAllProducts();

      if (trimmedQuery === '') {
        defaultContainer.style.display = 'flex';
        resultsContainer.style.display = 'none';
        if (statusEl) statusEl.innerHTML = '';
        return;
      }

      defaultContainer.style.display = 'none';
      resultsContainer.style.display = 'grid';

      const matchingProducts = allProducts.filter(p => p.title.toLowerCase().includes(trimmedQuery));

      if (statusEl) {
        statusEl.innerHTML = `
          <button style="width: 100%; background: transparent; border: 1px solid var(--border-color); padding: 12px; margin-bottom: 24px; font-family: var(--font-body); font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-main); cursor: pointer;" onclick="executeSearch('${trimmedQuery.replace(/'/g, "\\'")}');">
            VIEW ALL ${matchingProducts.length} RESULTS
          </button>
          <div style="font-size: 0.7rem; color: var(--text-muted); display: flex; gap: 16px;">
            <span>FILTERS:</span>
            <span>DISCOUNTS</span>
            <span>COLOR</span>
            <span>STYLE</span>
          </div>
        `;
      }

      resultsContainer.innerHTML = '';
      matchingProducts.forEach(product => {
        const itemEl = document.createElement('div');
        itemEl.className = 'search-result-item';
        
        itemEl.onclick = () => {
          closeSearchDrawer();
          if (product.originalCard) {
            product.originalCard.click();
          }
        };

        const mediaBox = document.createElement('div');
        mediaBox.className = 'search-result-media';
        
        const originalMedia = product.originalCard.querySelector('shopify-media');
        if (originalMedia) {
          const mediaClone = originalMedia.cloneNode(true);
          mediaBox.appendChild(mediaClone);
        } else {
          const fallbackImg = document.createElement('img');
          fallbackImg.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100';
          mediaBox.appendChild(fallbackImg);
        }

        const infoBox = document.createElement('div');
        infoBox.className = 'search-result-info';

        const titleEl = document.createElement('h4');
        titleEl.className = 'search-result-title';
        titleEl.textContent = product.title;

        const priceEl = document.createElement('span');
        priceEl.className = 'search-result-price';
        priceEl.textContent = product.price;

        infoBox.appendChild(titleEl);
        infoBox.appendChild(priceEl);

        itemEl.appendChild(mediaBox);
        itemEl.appendChild(infoBox);

        resultsContainer.appendChild(itemEl);
      });
    }

    // Scrapes DOM for loaded products to dynamically search
    function getAllProducts() {
      // Find cards inside shop list context, trousseau list, and engagement list
      const cards = document.querySelectorAll('#shop-list-context .glam-card, #trousseau-list-context .glam-card, #engagement-list-context .glam-card');
      const products = [];
      const seenTitles = new Set();

      cards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).trim();
        
        if (title && !seenTitles.has(title)) {
          seenTitles.add(title);
          const price = card.querySelector('.card-price')?.innerText || '';
          products.push({
            title: title,
            price: price,
            originalCard: card
          });
        }
      });
      return products;
    }

    // Auto-close search drawer on click outside or escape key
    document.addEventListener('click', (event) => {
      const drawer = document.getElementById('search-drawer');
      const trigger = document.querySelector('.search-btn');
      if (!drawer || !trigger) return;

      if (drawer.classList.contains('open') && !drawer.querySelector('.search-drawer-content').contains(event.target) && !trigger.contains(event.target)) {
        closeSearchDrawer();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSearchDrawer();
      }
    });

    // Filter carousel rows on Homepage
    function filterTrousseauCarousel(btnEl, filter) {
      activeTrousseauFilter = filter;
      
      // Toggle submenu links active states
      const section = btnEl.closest('.carousel-section-header');
      if (section) {
        section.querySelectorAll('.submenu-link').forEach(link => {
          link.classList.remove('active-submenu');
        });
      }
      btnEl.classList.add('active-submenu');
      
      applyCarouselFilters();
    }

    function applyCarouselFilters() {
      // Filter Trousseau Carousel
      const trousseauCards = document.querySelectorAll('#trousseau-list-context .glam-card');
      trousseauCards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();
        
        // Default trousseau criteria: boxes, hampers, covers, bags, pouches, organizers
        const isTrousseau = title.includes('box') || title.includes('hamper') || title.includes('cover') || title.includes('bag') || title.includes('pouch') || title.includes('trunk') || title.includes('basket') || title.includes('safa') || title.includes('organizer');
        
        let match = false;
        if (activeTrousseauFilter === 'all') {
          match = isTrousseau;
        } else if (activeTrousseauFilter === 'saree') {
          match = title.includes('saree') && isTrousseau;
        } else if (activeTrousseauFilter === 'suit') {
          match = (title.includes('suit') || title.includes('velvet')) && isTrousseau;
        } else if (activeTrousseauFilter === 'pouch') {
          match = (title.includes('pouch') || title.includes('bag') || title.includes('organizer')) && isTrousseau;
        } else if (activeTrousseauFilter === 'basket') {
          match = (title.includes('basket') || title.includes('trunk') || title.includes('box') || title.includes('baksa')) && isTrousseau;
        } else if (activeTrousseauFilter === 'band') {
          match = (title.includes('band') || title.includes('bangle') || title.includes('jewelry') || title.includes('set')) && isTrousseau;
        }
        
        card.style.display = match ? 'flex' : 'none';
      });

      // Filter Engagement Carousel
      const engagementCards = document.querySelectorAll('#engagement-list-context .glam-card');
      engagementCards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();
        
        // Engagement criteria: tray, platter, thali
        const isEngagement = title.includes('tray') || title.includes('platter') || title.includes('thali');
        card.style.display = isEngagement ? 'flex' : 'none';
      });

      // Filter Haldi Mini-Grid
      const haldiCards = document.querySelectorAll('#haldi-list-context .glam-mini-card');
      let count = 0;
      haldiCards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.mini-card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();
        
        // Match Haldi or Mehendi or floral
        const isHaldi = title.includes('haldi') || title.includes('mehendi') || title.includes('floral') || title.includes('kundan') || title.includes('yellow') || title.includes('rose gold');
        
        if (isHaldi && count < 5) {
          card.style.display = 'flex';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Opens a specific Journal article
    function openArticle(articleKey) {
      const article = ARTICLES_DB[articleKey];
      if (!article) return;
      
      const container = document.getElementById('article-detail-content');
      if (container) {
        container.innerHTML = `
          <header class="article-header">
            <span class="article-meta">${article.category} • ${article.date}</span>
            <h1 class="article-title">${article.title}</h1>
            <span class="article-author">${article.author}</span>
          </header>
          <div class="article-hero-img-box">
            <img class="article-hero-img" src="${article.img}" alt="${article.title}">
          </div>
          <div class="article-body-content">
            ${article.body}
          </div>
        `;
      }
      
      navigateTo('view-article-detail');
    }

    // Safe Buy Now / Instant Checkout handler
    function handleBuyNow(event) {
      const store = document.querySelector('shopify-store');
      const cart = document.getElementById('cart');
      if (store && typeof store.buyNow === 'function') {
        store.buyNow(event);
      } else if (cart && typeof cart.buyNow === 'function') {
        cart.buyNow(event);
      }
    }

    // Dynamic cart item quantity badge update
    function updateCartBadge() {
      const cartEl = document.getElementById('cart');
      const badge = document.querySelector('.cart-count-badge');
      if (!cartEl || !badge) return;
      
      const lines = cartEl.lines || cartEl.lineItems || (cartEl.cart && cartEl.cart.lines) || [];
      let count = 0;
      if (Array.isArray(lines)) {
        count = lines.reduce((total, line) => total + (line.quantity || 0), 0);
      } else if (typeof lines === 'number') {
        count = lines;
      }
      
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }

    // Set up MutationObserver to auto-filter shop grid when data renders from the SDK
    const shopObserver = new MutationObserver(() => {
      const cards = document.querySelectorAll('#view-shop .glam-card');
      if (cards.length > 0) {
        applyProductFilter();
      }
    });

    // Observer to automatically trigger filtering on product rows as they render
    const homeObserver = new MutationObserver((mutations) => {
      let shouldFilter = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.classList.contains('glam-card') ||
                node.classList.contains('glam-mini-card') ||
                node.querySelector('.glam-card') ||
                node.querySelector('.glam-mini-card')
              ) {
                shouldFilter = true;
                break;
              }
            }
          }
        }
        if (shouldFilter) break;
      }
      if (shouldFilter) {
        applyCarouselFilters();
      }
    });

    // Initialize listeners
    window.addEventListener('DOMContentLoaded', () => {
      const targetNode = document.querySelector('#view-shop .product-grid-container');
      if (targetNode) {
        shopObserver.observe(targetNode, { childList: true, subtree: true });
      }

      // Observe Home Page rows
      const homeNode = document.getElementById('view-home');
      if (homeNode) {
        homeObserver.observe(homeNode, { childList: true, subtree: true });
      }

      // Sync cart count badge initially
      updateCartBadge();
      
      // In case data is already loaded, apply filters immediately
      applyCarouselFilters();
      applyProductFilter();
    });

    // Automatically trigger cart count check on user click interactions
    document.addEventListener('click', () => {
      setTimeout(updateCartBadge, 800);
    });

    // Listen for storage updates
    window.addEventListener('storage', updateCartBadge);
