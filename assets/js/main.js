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
    // Listen for browser back/forward navigation
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.viewId) {
        navigateTo(event.state.viewId, false);
      } else {
        // If no state, go back to home
        navigateTo('view-home', false);
      }
    });

    // Navigates between SPA page views
    function navigateTo(viewId, updateHistory = true) {
      // Hide all page views
      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active-view');
      });

      // Show target view
      const targetView = document.getElementById(viewId);
      if (targetView) {
        targetView.classList.add('active-view');
        
        // Handle browser history integration
        if (updateHistory) {
          const currentUrl = window.location.hash.replace('#', '');
          if (currentUrl !== viewId) {
            history.pushState({ viewId: viewId }, "", `#${viewId}`);
          }
        }
      }

      // Update active state in nav link buttons
      document.querySelectorAll('.cat-nav-link').forEach(link => {
        link.classList.remove('active');
      });

      // Scroll window to top
      window.scrollTo(0, 0);
    }

    // Initialize history state on load
    window.addEventListener('DOMContentLoaded', () => {
      if (!history.state) {
        history.replaceState({ viewId: 'view-home' }, "", "#view-home");
      } else if (history.state.viewId) {
        navigateTo(history.state.viewId, false);
      }
    });

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
      
      // Inject Wishlist Button if not present
      setTimeout(() => injectPDPWishlist(), 100);
    }

    // Back navigation resolver
    function navigateBack() {
      if (history.length > 1) {
        history.back();
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
          matchesCategory = ['hamper', 'trousseau', 'set', 'gift'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'trays') {
          matchesCategory = ['tray', 'platter', 'thali', 'shagun', 'ring'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'saree-covers') {
          matchesCategory = ['saree', 'cover', 'suit', 'lehenga', 'gown', 'sherwani'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'bags') {
          matchesCategory = ['bag', 'potli', 'envelope', 'clutch', 'purse'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'baskets') {
          matchesCategory = ['basket', 'trunk', 'box', 'baksa'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'pouches') {
          matchesCategory = ['pouch', 'organizer', 'kit', 'case'].some(kw => title.includes(kw));
        } else if (activeShopFilter === 'bands') {
          matchesCategory = ['band', 'bangle', 'necklace', 'set', 'earring', 'choker', 'pendant', 'jewelry'].some(kw => title.includes(kw));
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
      const seenKeys = new Set();

      cards.forEach(card => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).trim();
        const productId = card.getAttribute('shopify-attr--data-id') || card.getAttribute('data-id');
        const dedupeKey = productId || title;
        
        if (title && !seenKeys.has(dedupeKey)) {
          seenKeys.add(dedupeKey);
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
        const isTrousseau = ['box', 'hamper', 'cover', 'bag', 'pouch', 'trunk', 'basket', 'safa', 'organizer', 'trousseau'].some(kw => title.includes(kw));
        
        let match = false;
        if (activeTrousseauFilter === 'all') {
          match = isTrousseau;
        } else if (activeTrousseauFilter === 'saree') {
          match = title.includes('saree') && isTrousseau;
        } else if (activeTrousseauFilter === 'suit') {
          match = (title.includes('suit') || title.includes('velvet') || title.includes('lehenga') || title.includes('gown')) && isTrousseau;
        } else if (activeTrousseauFilter === 'pouch') {
          match = ['pouch', 'bag', 'organizer', 'kit'].some(kw => title.includes(kw)) && isTrousseau;
        } else if (activeTrousseauFilter === 'basket') {
          match = ['basket', 'trunk', 'box', 'baksa'].some(kw => title.includes(kw)) && isTrousseau;
        } else if (activeTrousseauFilter === 'band') {
          match = ['band', 'bangle', 'jewelry', 'set'].some(kw => title.includes(kw)) && isTrousseau;
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
        const isEngagement = ['tray', 'platter', 'thali', 'shagun', 'ring', 'engagement'].some(kw => title.includes(kw));
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
        const isHaldi = ['haldi', 'mehendi', 'floral', 'kundan', 'yellow', 'rose gold', 'tray', 'platter', 'thali', 'shagun'].some(kw => title.includes(kw));
        
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
        setTimeout(populatePairsWith, 500);
      }
    });

    // Observer to automatically trigger filtering on product rows as they render
    let carouselFilterTimeout;
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
        clearTimeout(carouselFilterTimeout);
        carouselFilterTimeout = setTimeout(() => {
          applyCarouselFilters();
          populatePairsWith();
        }, 100);
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
      setTimeout(populatePairsWith, 1000);
    });

    // Populate "Pairs With" sidebar with real products from the DOM
    let pairsPopulated = false;
    function populatePairsWith() {
      if (pairsPopulated) return;
      const pairsContent = document.querySelector('.pairs-content');
      if (!pairsContent) return;
      
      const allProducts = getAllProducts();
      // Filter products that successfully loaded images
      const productsWithImages = allProducts.filter(p => {
         const originalMedia = p.originalCard.querySelector('shopify-media');
         const img = originalMedia ? originalMedia.querySelector('img') : null;
         return !!img || !!(p.originalCard.querySelector('img'));
      });
      
      if (productsWithImages.length < 2) return; // Wait until more products load
      
      // Take first 3 products for the sidebar
      const selected = productsWithImages.slice(0, 3);
      
      pairsContent.innerHTML = '';
      
      selected.forEach(product => {
        const originalMedia = product.originalCard.querySelector('shopify-media');
        const originalImg = originalMedia ? originalMedia.querySelector('img') : product.originalCard.querySelector('img');
        const imgSrc = originalImg ? originalImg.src : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300';
        
        const cardHtml = `
          <div class="pairs-card">
            <img src="${imgSrc}" alt="${product.title}" />
            <div class="pairs-info">
              <div class="pairs-title">${product.title}</div>
              <div class="pairs-price">${product.price}</div>
              <button class="pairs-add-btn">ADD <span>—</span></button>
            </div>
          </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHtml.trim();
        const cardEl = tempDiv.firstChild;
        
        const addBtn = cardEl.querySelector('.pairs-add-btn');
        addBtn.onclick = (e) => {
           e.stopPropagation();
           
           // Inject a temporary hidden button into the original card's context so addLine works
           const tempAddBtn = document.createElement('button');
           tempAddBtn.style.display = 'none';
           tempAddBtn.onclick = (evt) => {
               const cart = document.getElementById('cart');
               if (cart && cart.addLine) {
                   cart.addLine(evt);
               }
           };
           product.originalCard.appendChild(tempAddBtn);
           tempAddBtn.click();
           tempAddBtn.remove();
           
           addBtn.innerHTML = 'ADDED <span>✓</span>';
           setTimeout(() => { addBtn.innerHTML = 'ADD <span>—</span>'; }, 2000);
        };
        
        pairsContent.appendChild(cardEl);
      });
      
      pairsPopulated = true;
    }

    // Automatically trigger cart count check on user click interactions
    document.addEventListener('click', () => {
      setTimeout(updateCartBadge, 800);
    });

    // Listen for storage updates
    window.addEventListener('storage', updateCartBadge);

    /* =========================================================
       WISHLIST & CART CUSTOM SIDEBAR LOGIC
       ========================================================= */
    let wishlistItems = JSON.parse(localStorage.getItem('glamshack_wishlist')) || [];

    function openWishlistDrawer() {
      const drawer = document.getElementById('wishlist-drawer');
      const overlay = document.getElementById('wishlist-overlay');
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderWishlist();
    }

    function closeWishlistDrawer() {
      const drawer = document.getElementById('wishlist-drawer');
      const overlay = document.getElementById('wishlist-overlay');
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function toggleWishlist(productObj) {
      const index = wishlistItems.findIndex(i => i.id === productObj.id || i.title === productObj.title);
      if (index > -1) {
        wishlistItems.splice(index, 1);
      } else {
        wishlistItems.push(productObj);
      }
      localStorage.setItem('glamshack_wishlist', JSON.stringify(wishlistItems));
      openWishlistDrawer();
    }

    function removeFromWishlist(id) {
      wishlistItems = wishlistItems.filter(i => i.id !== id);
      localStorage.setItem('glamshack_wishlist', JSON.stringify(wishlistItems));
      renderWishlist();
    }

    function clearWishlist() {
      wishlistItems = [];
      localStorage.setItem('glamshack_wishlist', JSON.stringify(wishlistItems));
      renderWishlist();
    }

    function moveAllWishlistToBag() {
      if (wishlistItems.length === 0) return;
      const cart = document.getElementById('cart');
      if (!cart || !cart.addLine) return;
      
      alert('Adding wishlist items to cart. (Requires variant IDs mapped to backend API)');
      
      clearWishlist();
      closeWishlistDrawer();
      openCartDrawer();
    }

    function renderWishlist() {
      const container = document.getElementById('wishlist-items-container');
      if (!container) return;
      
      if (wishlistItems.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.85rem;">Your wishlist is currently empty.</p>';
        return;
      }
      
      container.innerHTML = wishlistItems.map(item => `
        <div class="wishlist-item">
          <img src="${item.image}" alt="${item.title}" class="wishlist-item-img">
          <div class="wishlist-item-info">
            <div class="wishlist-item-top">
              <div>
                <div class="wishlist-item-title">${item.title}</div>
                <div class="wishlist-item-variant">${item.variant || 'Standard'}</div>
              </div>
              <button class="wishlist-item-remove" onclick="removeFromWishlist('${item.id}')">🗑</button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div class="wishlist-item-price">${item.price}</div>
              <div class="wishlist-qty-selector">
                <button class="wishlist-qty-btn">-</button>
                <span class="wishlist-qty-val">1</span>
                <button class="wishlist-qty-btn">+</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // CART PAIRS WITH LOGIC
    function openCartDrawer() {
      closeWishlistDrawer();
      const cart = document.getElementById('cart');
      const pairsSidebar = document.getElementById('cart-pairs-sidebar');
      if (cart && typeof cart.showModal === 'function') {
        cart.showModal();
        if (pairsSidebar) {
          setTimeout(() => {
            pairsSidebar.classList.add('open');
          }, 50);
        }
      }
    }

    // Use MutationObserver on the cart shadowRoot dialog (if accessible) to sync the pairs sidebar close state
    setInterval(() => {
      const pairsSidebar = document.getElementById('cart-pairs-sidebar');
      const cart = document.getElementById('cart');
      if (cart && cart.shadowRoot) {
        // Inject brute-force CSS if missing for the dialog structure itself
        if (!cart.shadowRoot.getElementById('glamshack-custom-cart-css')) {
          const style = document.createElement('style');
          style.id = 'glamshack-custom-cart-css';
          style.textContent = `
            dialog {
              background-color: #f4f3ef !important;
              width: 450px !important;
              max-width: 90vw !important;
              height: 100vh !important;
              max-height: 100vh !important;
              min-height: 100vh !important;
              margin: 0 !important;
              padding: 0 !important;
              position: fixed !important;
              inset: 0 0 0 auto !important;
              border-radius: 0 !important;
              color: #12141d !important;
            }
          `;
          cart.shadowRoot.appendChild(style);
        }
        
        // Dynamically find and style the checkout button by text content or slot to bypass all class/part restrictions
        const allBtns = cart.shadowRoot.querySelectorAll('button, a');
        allBtns.forEach(btn => {
          const txt = btn.textContent.toUpperCase();
          const html = btn.outerHTML.toUpperCase();
          const hasSlot = btn.querySelector('slot[name="checkout-button"]');
          const isCheckout = hasSlot || 
                             txt.includes('CHECKOUT') || 
                             txt.includes('ORDER') || 
                             html.includes('CHECKOUT');
                             
          if (isCheckout) {
            btn.style.backgroundColor = '#4b5344';
            btn.style.color = '#ffffff';
            btn.style.borderRadius = '0';
            btn.style.border = 'none';
            btn.style.outline = 'none';
            btn.style.boxShadow = 'none';
          }
        });
        
        if (pairsSidebar && pairsSidebar.classList.contains('open')) {
          const dialog = cart.shadowRoot.querySelector('dialog');
          if (dialog && !dialog.hasAttribute('open')) {
            pairsSidebar.classList.remove('open');
          }
        }
      }
    }, 300);

    // Override existing cart triggers
    document.addEventListener('DOMContentLoaded', () => {
      const cartButtons = document.querySelectorAll('.btn-open-cart');
      cartButtons.forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          openCartDrawer();
        };
      });
    });
