import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductGrid() {
  const navigate = useNavigate();

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

  return (
    <div className="collection-product-grid">
      <shopify-context type="collection" handle="frontpage" onClick={handleProductCardClick}>
        <template dangerouslySetInnerHTML={{ __html: `
          <shopify-list-context
            id="collection-list-context"
            type="product"
            query="products"
            first="12"
          >
            <template>
              <div class="leather-family-card collection-card" shopify-attr--data-handle="product.handle" shopify-attr--data-title="product.title">
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
    </div>
  );
}
