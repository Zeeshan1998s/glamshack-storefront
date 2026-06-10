import React from 'react';

export default function CollectionFilterBar() {
  return (
    <div className="collection-filter-bar">
      <div className="filter-left">
        <span className="filter-label">FILTER</span>
        <button className="filter-btn">DISCOUNT</button>
        <button className="filter-btn">COLOR</button>
        <button className="filter-btn">STYLE</button>
      </div>

      <div className="filter-center">
        {/* Toggle Grid Icons */}
        <button className="grid-toggle-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" />
            <rect x="9" y="2" width="5" height="5" />
            <rect x="2" y="9" width="5" height="5" />
            <rect x="9" y="9" width="5" height="5" />
          </svg>
        </button>
        <button className="grid-toggle-btn active">
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
