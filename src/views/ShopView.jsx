import  { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ShopView.css';

export default function ShopView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  // Core search / category state
  const activeShopFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // New functional filters state
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  
  // UI state for dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null); // 'color' | 'style' | null
  
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      // Grab from light DOM
      cards.push(...shopList.querySelectorAll('.leather-family-card'));
      // Grab from shadow DOM
      if (shopList.shadowRoot) {
        cards.push(...shopList.shadowRoot.querySelectorAll('.leather-family-card'));
      }

      const emptyState = document.getElementById('shop-empty-state');
      if (cards.length === 0) {
        setProductCount(0);
        return;
      }

      let matchCount = 0;
      const trimmedSearch = searchQuery.toLowerCase();
      const colorFilter = selectedColor.toLowerCase();
      const styleFilter = selectedStyle.toLowerCase();

      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();

        // 1. Check Legacy Category Match
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

        // 2. Check Search Query Match
        const matchesSearch = title.includes(trimmedSearch);

        // 3. Check Discount Filter
        let matchesDiscount = true;
        if (isDiscountActive) {
          // Attempt to extract prices. Shopify component often renders price formats like Rs. 500.00
          const priceText = card.querySelector('.price-new')?.innerText || '';
          const compareText = card.querySelector('.price-old')?.innerText || '';
          
          const extractNum = (str) => {
             const matches = str.replace(/,/g, '').match(/[\d.]+/);
             return matches ? parseFloat(matches[0]) : 0;
          };
          
          const currentPrice = extractNum(priceText);
          const comparePrice = extractNum(compareText);
          
          if (comparePrice <= currentPrice || currentPrice === 0) {
            matchesDiscount = false;
          }
        }

        // 4. Check Color Filter
        let matchesColor = true;
        if (colorFilter) {
          matchesColor = title.includes(colorFilter);
        }

        // 5. Check Style Filter
        let matchesStyle = true;
        if (styleFilter) {
          matchesStyle = title.includes(styleFilter);
        }

        if (matchesCategory && matchesSearch && matchesDiscount && matchesColor && matchesStyle) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      setProductCount(matchCount);

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
  }, [activeShopFilter, searchQuery, isDiscountActive, selectedColor, selectedStyle]);

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

  const handleLocalSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (localQuery.trim()) {
          params.set('q', localQuery.trim());
        } else {
          params.delete('q');
        }
        return params;
      });
    }
  };

  const handleProductCardClick = (e) => {
    const card = e.target.closest('.leather-family-card');
    if (card) {
      const handle = card.getAttribute('data-handle') || card.getAttribute('shopify-attr--data-handle');
      if (handle) {
        navigate(`/product?handle=${handle}`);
      } else {
        navigate('/product');
      }
    }
  };

  const colors = ['Black', 'Brown', 'Beige', 'Red', 'Blue', 'White'];
  const styles = ['Tote', 'Sling', 'Potli', 'Clutch', 'Backpack'];

  return (
    <div id="view-shop" className="page-view active-view">
      {searchQuery ? (
        <>
          {/* New Figma Redesign for Search Main Page */}
          <div className="search-banner">
            <div className="search-breadcrumbs">
              <span className="home">HOME</span> / <span>{productCount} PRODUCTS</span>
            </div>
            <div className="search-header-flex">
              <span className="search-you-searched-for">You searched for</span>
              <div className="search-query-container">
                <input 
                  type="text"
                  className="search-query-text search-query-input"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={handleLocalSearchSubmit}
                  placeholder="Type to search..."
                />
              </div>
            </div>
          </div>
          
          <div className="search-filters-bar" ref={dropdownRef}>
            <span className="filter-label">Filters :</span>
            
            <button 
              className={`filter-option ${isDiscountActive ? 'active' : ''}`}
              onClick={() => setIsDiscountActive(!isDiscountActive)}
            >
              Discounts
            </button>

            <div className="filter-wrapper">
              <button 
                className={`filter-option ${selectedColor || activeDropdown === 'color' ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
              >
                {selectedColor ? `Color: ${selectedColor}` : 'Color'}
              </button>
              {activeDropdown === 'color' && (
                <div className="filter-dropdown">
                  <button 
                    className={`filter-dropdown-item ${selectedColor === '' ? 'selected' : ''}`}
                    onClick={() => { setSelectedColor(''); setActiveDropdown(null); }}
                  >
                    All Colors
                  </button>
                  {colors.map(color => (
                    <button 
                      key={color}
                      className={`filter-dropdown-item ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => { setSelectedColor(color); setActiveDropdown(null); }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-wrapper">
              <button 
                className={`filter-option ${selectedStyle || activeDropdown === 'style' ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
              >
                {selectedStyle ? `Style: ${selectedStyle}` : 'Style'}
              </button>
              {activeDropdown === 'style' && (
                <div className="filter-dropdown">
                  <button 
                    className={`filter-dropdown-item ${selectedStyle === '' ? 'selected' : ''}`}
                    onClick={() => { setSelectedStyle(''); setActiveDropdown(null); }}
                  >
                    All Styles
                  </button>
                  {styles.map(style => (
                    <button 
                      key={style}
                      className={`filter-dropdown-item ${selectedStyle === style ? 'selected' : ''}`}
                      onClick={() => { setSelectedStyle(style); setActiveDropdown(null); }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Legacy Default Catalog View */
        <main className="container" style={{ paddingTop: '100px' }}>
          <div className="section-header" id="shop-default-header">
            <span className="section-title-tag">Our Curated Catalog</span>
            <h2 className="section-main-title">Explore Collection</h2>
          </div>

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
        </main>
      )}

      {/* Shared Product Grid Container */}
      <div className={searchQuery ? 'shop-view-grid-container' : 'container'}>
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
                  <div class="leather-family-card pdp-related-card" shopify-attr--data-handle="product.handle" shopify-attr--data-title="product.title">
                    <div class="wishlist-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                    <div class="card-media-wrapper">
                      <shopify-media width="400" height="400" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                    </div>
                    <div class="card-details">
                      <div class="card-info-row">
                        <h3 class="card-title"><shopify-data query="product.title"></shopify-data></h3>
                        <div class="card-price-box">
                          <span class="price-old"><shopify-money query="product.selectedOrFirstAvailableVariant.compareAtPrice"></shopify-money></span>
                          <span class="price-new"><shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></span>
                        </div>
                      </div>
                      <div class="card-hover-actions">
                        <span class="add-to-bag-text">ADD TO BAG &mdash;</span>
                        <div class="swatches-container">
                          <div class="swatch"><img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop" alt="swatch"></div>
                          <div class="swatch"><img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop" alt="swatch"></div>
                          <div class="swatch"><img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop" alt="swatch"></div>
                          <span class="swatch-plus">+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div shopify-loading-placeholder="" class="product-grid">
                  <div class="leather-family-card loading-pulse" style="height: 380px;"></div>
                  <div class="leather-family-card loading-pulse" style="height: 380px;"></div>
                  <div class="leather-family-card loading-pulse" style="height: 380px;"></div>
                  <div class="leather-family-card loading-pulse" style="height: 380px;"></div>
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

          <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
            {searchQuery ? (
              <button className="load-more-btn">LOAD MORE</button>
            ) : (
              <button
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
