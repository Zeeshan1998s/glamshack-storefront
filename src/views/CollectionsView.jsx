import React from 'react';
import CollectionHeader from '../components/CollectionHeader';
import CollectionFilterBar from '../components/CollectionFilterBar';
import ProductGrid from '../components/ProductGrid';
import './CollectionsView.css';

export default function CollectionsView() {
  return (
    <div id="view-collections" className="page-view active-view" style={{ backgroundColor: '#f6f5f3' }}>
      
      {/* Header with Title and Subcategories */}
      <CollectionHeader />

      {/* Filter and Sort Bar */}
      <CollectionFilterBar />

      {/* Grid of Products */}
      <ProductGrid />

      {/* Load More Button */}
      <div className="collection-load-more-container">
        <button className="collection-load-more-btn">LOAD MORE</button>
      </div>

      {/* Pre-footer Landscape Image */}
      <section className="home-pre-footer">
        <img
          src="https://images.unsplash.com/photo-1513689125086-6c432170e843?w=2000&auto=format&fit=crop"
          alt="Mountains and Forests"
          style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }}
        />
      </section>
    </div>
  );
}
