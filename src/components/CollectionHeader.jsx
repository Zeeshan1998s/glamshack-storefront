import React from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All Products', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop' },
  { id: 'hampers', label: 'Hampers', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'trays', label: 'Platters & Trays', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'saree-covers', label: 'Saree Covers', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop' },
  { id: 'bags', label: 'Bags & Potlis', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop' },
  { id: 'baskets', label: 'Baskets & Trunks', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'pouches', label: 'Pouches', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'bands', label: 'Bands & Jewelry', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop' },
];

export default function CollectionHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleFilterChange = (categoryId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('category', categoryId);
      return params;
    });
  };

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="collection-header-container">
      <div className="collection-breadcrumbs">
        HOME / ALL CATEGORIES / {activeCategoryData.label.toUpperCase()}
      </div>
      <div className="collection-header-content">
        <h1 className="collection-title">{activeCategoryData.label}</h1>
        <p className="collection-subtitle">
          Explore our exclusive collection of {activeCategoryData.label.toLowerCase()}. Carefully curated for the best quality and design.
        </p>
      </div>
      <div className="collection-subcategories">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            className={`subcategory-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleFilterChange(cat.id)}
            style={{ cursor: 'pointer', opacity: activeCategory === cat.id ? 1 : 0.6 }}
          >
            <img src={cat.img} alt={cat.label} className="subcategory-img" />
            <span className="subcategory-label">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
