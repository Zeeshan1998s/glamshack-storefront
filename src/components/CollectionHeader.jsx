import React from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All Products', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop', type: 'all' },
  { id: 'brocade-boxes', label: 'Brocade Boxes', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop', type: 'Brocade boxes' },
  { id: 'dry-fruit-trays', label: 'Dry Fruit Trays', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop', type: 'Dry Fruit Trays' },
  { id: 'engagement-platters', label: 'Engagement Platters', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop', type: 'Engagement Platters' },
  { id: 'flat-trays', label: 'Flat Trays', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop', type: 'Flat trays' },
  { id: 'fruit-baskets', label: 'Fruit Baskets', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop', type: 'Fruit baskets' },
  { id: 'haldi-platter', label: 'Haldi Platter', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop', type: 'Haldi Platter' },
  { id: 'luggage-bands', label: 'Luggage Bands', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop', type: 'Luggage bands' },
  { id: 'mehendi-platters', label: 'Mehendi Platters', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop', type: 'Mehendi Platters' },
  { id: 'nikahnama', label: 'Nikahnama', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop', type: 'Nikahnama' },
  { id: 'saree-bands', label: 'Saree Bands', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop', type: 'Saree Bands' },
  { id: 'suede-trays', label: 'Suede Trays', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop', type: 'Suede trays' },
  { id: 'trunks', label: 'Trunks', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop', type: 'Trunks' }
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
