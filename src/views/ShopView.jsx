import  { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ShopView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeShopFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const getCollectionHandle = () => {
    if (activeShopFilter === 'bands') return 'bands';
    if (activeShopFilter === 'trays') return 'suede-trays';
    if (activeShopFilter === 'saree-covers') return 'saree-boxes';
    if (activeShopFilter === 'baskets') return 'saree-boxes';
    // Fallback collection to force a request and return products
    return 'frontpage';
  };

  useEffect(() => {
    let intervalId;
    let observer;
    let shadowObserver;

    const applyProductFilter = () => {
      const shopList = document.getElementById('shop-list-context');
      if (!shopList) return;

      const cards = [];
      // 1. Grab from light DOM
      cards.push(...shopList.querySelectorAll('.glam-card'));
      // 2. Grab from shadow DOM
      if (shopList.shadowRoot) {
        cards.push(...shopList.shadowRoot.querySelectorAll('.glam-card'));
      }

      const emptyState = document.getElementById('shop-empty-state');
      if (cards.length === 0) return;

      let matchCount = 0;
      const trimmedSearch = searchQuery.toLowerCase();

      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();

        let matchesCategory = false;
        if (activeShopFilter === 'all') {
          matchesCategory = true;
        } else if (activeShopFilter === 'hampers') {
          matchesCategory = ['hamper', 'trousseau', 'set', 'gift'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'trays') {
          matchesCategory = ['tray', 'platter', 'thali', 'shagun', 'ring'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'saree-covers') {
          matchesCategory = ['saree', 'cover', 'suit', 'lehenga', 'gown', 'sherwani'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'bags') {
          matchesCategory = ['bag', 'potli', 'envelope', 'clutch', 'purse'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'baskets') {
          matchesCategory = ['basket', 'trunk', 'box', 'baksa'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'pouches') {
          matchesCategory = ['pouch', 'organizer', 'kit', 'case'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'bands') {
          matchesCategory = ['band', 'bangle', 'necklace', 'set', 'earring', 'choker', 'pendant', 'jewelry'].some((kw) => title.includes(kw));
        }

        const matchesSearch = title.includes(trimmedSearch);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = matchCount === 0 ? 'flex' : 'none';
      }
    };

    // Run initial filter check
    applyProductFilter();

    // Polling fallback to capture async rendering
    intervalId = setInterval(applyProductFilter, 800);

    const shopList = document.getElementById('shop-list-context');
    if (shopList) {
      // Observe light DOM mutations inside shop-list-context
      observer = new MutationObserver(applyProductFilter);
      observer.observe(shopList, { childList: true, subtree: true });

      // Observe shadow DOM mutations if shadowRoot is available
      if (shopList.shadowRoot) {
        shadowObserver = new MutationObserver(applyProductFilter);
        shadowObserver.observe(shopList.shadowRoot, { childList: true, subtree: true });
      }
    }

    return () => {
      clearInterval(intervalId);
      if (observer) observer.disconnect();
      if (shadowObserver) shadowObserver.disconnect();
    };
  }, [activeShopFilter, searchQuery]);

  const handleFilterChange = (category) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('category', category);
      return params;
    });
  };

  const handleClearSearch = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('q');
      return params;
    });
  };

  const handleProductCardClick = (e) => {
    const card = e.target.closest('.glam-card');
    if (card) {
      const handle = card.getAttribute('data-handle') || card.getAttribute('shopify-attr--data-handle');
      if (handle) {
        navigate(`/product?handle=${handle}`);
      } else {
        navigate('/product');
      }
    }
  };

  return (
    <div id="view-shop" className="page-view active-view">
      <main className="container">
        <div className="shop-header-wrapper" style={{ marginTop: '40px', marginBottom: '20px' }}>
          {/* <div
            className="breadcrumb"
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              fontWeight: 600,
              letterSpacing: '0.1em'
            }}
          >
            HOME / PRODUCTS
          </div> */}
          {searchQuery && (
            <div
              id="search-title-wrapper"
              style={{
                display: 'block',
                borderBottom: '1px solid var(--text-main)',
                paddingBottom: '10px',
                marginBottom: '40px'
              }}
            >
              <h1
                id="shop-search-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  color: 'var(--text-main)',
                  margin: 0,
                  textTransform: 'capitalize'
                }}
              >
                Search: {searchQuery}
              </h1>
            </div>
          )}
        </div>

        {!searchQuery && (
          <div className="section-header" id="shop-default-header">
            <span className="section-title-tag">Our Curated Catalog</span>
            <h2 className="section-main-title">Explore Collection</h2>
          </div>
        )}

        {/* Dynamic filter tabs */}
        <div className="collection-tabs">
          <button
            className={`btn-tab ${activeShopFilter === 'all' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Products
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'hampers' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('hampers')}
          >
            Hampers
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'trays' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('trays')}
          >
            Platters & Trays
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'saree-covers' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('saree-covers')}
          >
            Saree Covers
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'bags' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('bags')}
          >
            Bags & Potlis
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'baskets' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('baskets')}
          >
            Baskets & Trunks
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'pouches' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('pouches')}
          >
            Pouches
          </button>
          <button
            className={`btn-tab ${activeShopFilter === 'bands' ? 'active-tab' : ''}`}
            onClick={() => handleFilterChange('bands')}
          >
            Bands & Jewelry
          </button>
        </div>

        <div className="product-grid-container">
          <shopify-context
            key={activeShopFilter + '-' + searchQuery}
            type={activeShopFilter === 'all' ? 'shop' : 'collection'}
            handle={activeShopFilter === 'all' ? undefined : getCollectionHandle()}
            onClick={handleProductCardClick}
          >
            <template dangerouslySetInnerHTML={{ __html: `
              <shopify-list-context
                id="shop-list-context"
                type="product"
                query="products"
                first="28"
              >
                <template>
                  <div class="glam-card" shopify-attr--data-handle="product.handle" shopify-attr--data-title="product.title" style="cursor: pointer;">
                    <div class="card-media-wrapper">
                      <div class="card-badge">Luxe</div>
                      <shopify-media width="300" height="300" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                      <div class="card-hover-overlay">View Details</div>
                    </div>
                    <div class="card-details">
                      <h3 class="card-title"><shopify-data query="product.title"></shopify-data></h3>
                      <div class="card-price"><shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></div>
                    </div>
                  </div>
                </template>
                <div shopify-loading-placeholder="" class="product-grid">
                  <div class="glam-card loading-pulse" style="height: 380px;"></div>
                  <div class="glam-card loading-pulse" style="height: 380px;"></div>
                  <div class="glam-card loading-pulse" style="height: 380px;"></div>
                  <div class="glam-card loading-pulse" style="height: 380px;"></div>
                </div>
              </shopify-list-context>
            `}} />
          </shopify-context>

          {/* Dynamic Empty State Placeholder */}
          <div id="shop-empty-state" className="shop-empty-state" style={{ display: 'none' }}>
            <div className="empty-state-icon">👜</div>
            <h3 className="empty-state-title">No Products Found</h3>
            <p className="empty-state-text">
              We couldn't find any products matching your selection. Try browsing another category or clearing your search.
            </p>
            <button
              onClick={() => {
                handleFilterChange('all');
                handleClearSearch();
              }}
              className="empty-state-btn"
            >
              View All Products
            </button>
          </div>

          <div className="load-more-wrapper" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
            <button
              className="btn-load-more"
              style={{
                background: 'transparent',
                border: '1px solid var(--text-main)',
                color: 'var(--text-main)',
                padding: '12px 40px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              LOAD MORE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
