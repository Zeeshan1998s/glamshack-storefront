import  { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchDrawer({
  isOpen,
  onClose,
  allProducts = []
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleInput = (val) => {
    setQuery(val);
    const trimmed = val.trim().toLowerCase();
    if (trimmed === '') {
      setResults([]);
      return;
    }
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(trimmed)
    );
    setResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(query);
    }
  };

  const executeSearch = (searchVal) => {
    const trimmed = searchVal.trim();
    if (trimmed !== '') {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
    onClose();
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
    onClose();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleSuggestionClick = (product) => {
    onClose();
    if (product.originalCard) {
      product.originalCard.click();
    }
    navigate('/product');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="search-drawer-overlay open" onClick={onClose}></div>
      <div className="search-drawer open">
        <div className="search-drawer-left">
          {/* Navigation Links */}
          <nav className="search-drawer-nav">
            <button className="search-nav-link" onClick={() => handleCategoryClick('all')}>
              SALE
            </button>
            <button className="search-nav-link" onClick={() => handleCategoryClick('hampers')}>
              NEW
            </button>
            <button className="search-nav-link" onClick={() => handleCategoryClick('bags')}>
              BAGS
            </button>
            <button className="search-nav-link" onClick={() => handleCategoryClick('baskets')}>
              ACCESSORIES
            </button>
            <button className="search-nav-link" onClick={() => handleCategoryClick('saree-covers')}>
              CASHMERE
            </button>
            <button className="search-nav-link" onClick={() => handleCategoryClick('trays')}>
              GIFTS
            </button>
          </nav>

          {/* Search Input */}
          <div className="search-drawer-input-wrapper">
            <input
              type="text"
              ref={inputRef}
              className="search-drawer-input"
              placeholder="TYPE TO SEARCH"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query.trim() !== '' && (
              <button className="search-drawer-clear-btn" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>

          {/* Status Panel */}
          {query.trim() !== '' && (
            <div className="search-drawer-status">
              <button
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  padding: '12px',
                  marginBottom: '24px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
                onClick={() => executeSearch(query)}
              >
                VIEW ALL {results.length} RESULTS
              </button>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                <span>FILTERS:</span>
                <span>DISCOUNTS</span>
                <span>COLOR</span>
                <span>STYLE</span>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="search-drawer-footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>CONTACT US</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>FAQS</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>DELIVERY</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>RETURN POLICY</a>
          </div>
        </div>

        <div className="search-drawer-right">
          <button className="search-drawer-close-btn" onClick={onClose}>
            ✕
          </button>

          {/* Default view when empty */}
          {query.trim() === '' ? (
            <div className="search-drawer-default">
              <div className="featured-stories">
                <p className="featured-title">Featured stories</p>
                <img
                  src="https://images.unsplash.com/photo-1549497554-469b6db94901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Leather working"
                  className="featured-image"
                />
                <div className="featured-caption">
                  <span className="date">MARCH 24, 2025</span>
                  <span className="desc">Facts, not fiction</span>
                </div>
              </div>
            </div>
          ) : (
            /* Grid view when searching */
            <div className="search-drawer-results-grid">
              {results.map((product, idx) => (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="search-result-media">
                    {product.imageSrc ? (
                      <img src={product.imageSrc} alt={product.title} />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100"
                        alt="Placeholder"
                      />
                    )}
                  </div>
                  <div className="search-result-info">
                    <h4 className="search-result-title">{product.title}</h4>
                    <span className="search-result-price">{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
