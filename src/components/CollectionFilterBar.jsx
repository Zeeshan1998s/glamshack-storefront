import React, { useRef, useEffect } from 'react';

export default function CollectionFilterBar({
  isDiscountActive, setIsDiscountActive,
  selectedColor, setSelectedColor,
  selectedStyle, setSelectedStyle,
  activeDropdown, setActiveDropdown,
  gridView, setGridView
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveDropdown]);

  const colors = ['Black', 'Brown', 'Beige', 'Red', 'Blue', 'White'];
  const styles = ['Tote', 'Sling', 'Potli', 'Clutch', 'Backpack'];

  return (
    <div className="collection-filter-bar" ref={dropdownRef}>
      <div className="filter-left">
        <span className="filter-label">FILTER</span>
        <button
          className={`filter-btn ${isDiscountActive ? 'active' : ''}`}
          onClick={() => setIsDiscountActive(!isDiscountActive)}
        >
          DISCOUNT
        </button>

        <div className="filter-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          <button
            className={`filter-btn ${selectedColor || activeDropdown === 'color' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
          >
            {selectedColor ? `COLOR: ${selectedColor.toUpperCase()}` : 'COLOR'}
          </button>
          {activeDropdown === 'color' && (
            <div className="filter-dropdown" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #ccc', minWidth: '150px' }}>
              <button
                className="filter-dropdown-item"
                style={{ width: '100%', padding: '8px', textAlign: 'left', background: selectedColor === '' ? '#f0f0f0' : 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => { setSelectedColor(''); setActiveDropdown(null); }}
              >
                All Colors
              </button>
              {colors.map(color => (
                <button
                  key={color}
                  className="filter-dropdown-item"
                  style={{ width: '100%', padding: '8px', textAlign: 'left', background: selectedColor === color ? '#f0f0f0' : 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setSelectedColor(color); setActiveDropdown(null); }}
                >
                  {color}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="filter-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          <button
            className={`filter-btn ${selectedStyle || activeDropdown === 'style' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
          >
            {selectedStyle ? `STYLE: ${selectedStyle.toUpperCase()}` : 'STYLE'}
          </button>
          {activeDropdown === 'style' && (
            <div className="filter-dropdown" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #ccc', minWidth: '150px' }}>
              <button
                className="filter-dropdown-item"
                style={{ width: '100%', padding: '8px', textAlign: 'left', background: selectedStyle === '' ? '#f0f0f0' : 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => { setSelectedStyle(''); setActiveDropdown(null); }}
              >
                All Styles
              </button>
              {styles.map(style => (
                <button
                  key={style}
                  className="filter-dropdown-item"
                  style={{ width: '100%', padding: '8px', textAlign: 'left', background: selectedStyle === style ? '#f0f0f0' : 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setSelectedStyle(style); setActiveDropdown(null); }}
                >
                  {style}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-center">
        {/* Toggle Grid Icons */}
        <button 
          className={`grid-toggle-btn ${gridView === 'default' ? 'active' : ''}`}
          onClick={() => setGridView('default')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" />
            <rect x="9" y="2" width="5" height="5" />
            <rect x="2" y="9" width="5" height="5" />
            <rect x="9" y="9" width="5" height="5" />
          </svg>
        </button>
        <button 
          className={`grid-toggle-btn ${gridView === 'gallery' ? 'active' : ''}`}
          onClick={() => setGridView('gallery')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="3" height="3" />
            <rect x="6" y="1" width="3" height="3" />
            <rect x="11" y="1" width="3" height="3" />

            <rect x="1" y="6" width="3" height="3" />
            <rect x="6" y="6" width="3" height="3" />
            <rect x="11" y="6" width="3" height="3" />

            <rect x="1" y="11" width="3" height="3" />
            <rect x="6" y="11" width="3" height="3" />
            <rect x="11" y="11" width="3" height="3" />
          </svg>
        </button>
      </div>

      <div className="filter-right">
        <span className="sort-label">SORT BY</span>
        <select className="sort-select">
          <option value="relevance">RELEVANCE</option>
          <option value="price-asc">PRICE: LOW TO HIGH</option>
          <option value="price-desc">PRICE: HIGH TO LOW</option>
          <option value="newest">NEWEST</option>
        </select>
      </div>
    </div>
  );
}
