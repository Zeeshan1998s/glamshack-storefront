import React from 'react';

export default function CollectionHeader() {
  return (
    <div className="collection-header-container">
      <div className="collection-breadcrumbs">
        HOME / ALL CATEGORIES / MY PRODUCTS
      </div>
      <div className="collection-header-content">
        <h1 className="collection-title">Bags</h1>
        <p className="collection-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
        </p>
      </div>
      <div className="collection-subcategories">
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop" alt="Briefcases" className="subcategory-img" />
          <span className="subcategory-label">Briefcases</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop" alt="Computer Folders" className="subcategory-img" />
          <span className="subcategory-label">Computer<br/>Folders</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop" alt="Backpacks" className="subcategory-img" />
          <span className="subcategory-label">Backpacks</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop" alt="Gym Bags" className="subcategory-img" />
          <span className="subcategory-label">Gym Bags</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop" alt="Duffle Bags" className="subcategory-img" />
          <span className="subcategory-label">Duffle Bags</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop" alt="Tote Bags" className="subcategory-img" />
          <span className="subcategory-label">Tote Bags</span>
        </div>
        <div className="subcategory-item">
          <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop" alt="Shopper Bags" className="subcategory-img" />
          <span className="subcategory-label">Shopper<br/>Bags</span>
        </div>
      </div>
    </div>
  );
}
