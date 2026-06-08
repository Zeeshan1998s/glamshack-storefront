import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeView() {
  const [trousseauFilter, setTrousseauFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const applyCarouselFilters = () => {
      const cards = document.querySelectorAll('#story-list .leather-family-card');
      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();

        let match = false;
        if (trousseauFilter === 'all') {
          match = true;
        } else if (trousseauFilter === 'basket') {
          match = ['basket', 'trunk', 'box', 'baksa', 'hamper'].some((kw) => title.includes(kw));
        } else if (trousseauFilter === 'tray') {
          match = ['tray', 'platter', 'thali', 'shagun', 'ring'].some((kw) => title.includes(kw));
        }

        card.style.display = match ? 'flex' : 'none';
      });
    };

    applyCarouselFilters();

    const container = document.getElementById('story-list');
    if (container) {
      const observer = new MutationObserver(applyCarouselFilters);
      observer.observe(container, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [trousseauFilter]);

  const handleProductCardClick = (e) => {
    const card = e.target.closest('.leather-family-card');
    if (card) {
      const pdpContext = document.getElementById('pdp-context');
      if (pdpContext) {
        const updateFn = pdpContext.update || pdpContext.updateContext;
        if (typeof updateFn === 'function') {
          updateFn.call(pdpContext, e.nativeEvent);
        }
      }
      navigate('/product');
    }
  };

  return (
    <div id="view-home" className="page-view active-view">
      {/* SECTION 1: FULL BLEED HERO */}
      <section className="home-hero-full">
        <img
          className="home-hero-bg"
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&auto=format&fit=crop"
          alt="Wedding Preparation"
        />
        <div className="home-hero-content">
          <h1 className="hero-display-title">PREMIUM WEDDING TROUSSEAU & LUXURY PACKAGING</h1>
          <p className="hero-display-subtitle">
            Explore our handcrafted collection of ring platters, hampers, and bridal essentials.
          </p>
          <button className="btn-hero-shop" onClick={() => navigate('/shop')}>
            Shop Collection
          </button>
        </div>
      </section>

      {/* SECTION 2: BRAND STORY & TRUST BADGES */}
      <section className="home-brand-story">
        <div className="brand-story-left">
          <h2 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', marginBottom: '50px', lineHeight: 1.3 }}>
            “We believe that every celebration deserves to be presented beautifully. Our bespoke trousseau trunks, elegant
            ring platters, and luxury gifting accessories are meticulously handcrafted to make your special moments truly
            unforgettable.”
          </h2>
          <div className="trust-badges" style={{ alignItems: 'center', gap: '30px', marginTop: '20px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', lineHeight: 1.2, textAlign: 'left', maxWidth: '80px', color: '#111' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📈</div>
              SCIENCE<br />BASED<br />TARGETS
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.2, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ background: '#27ae60', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                🌿
              </div>
              <div>future Net Zero<br />STANDARD</div>
            </div>
            <div style={{ fontSize: '2rem', color: '#111' }}>🐼</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.2, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '1.5rem' }}>🌐</div>
              <div>United Nations<br />Global Compact</div>
            </div>
            <div style={{ border: '2px solid #c9a753', borderRadius: '50%', width: '55px', height: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 'bold', color: '#111', lineHeight: 1.1 }}>
              <span style={{ color: '#c9a753' }}>GOLD</span>
              <span>2023</span>
              <span>ecovadis</span>
            </div>
          </div>
        </div>
        <div className="brand-story-right">
          <img
            className="brand-story-img-main"
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop"
            alt="Lifestyle Shoot"
          />
          <img
            className="brand-story-img-small"
            src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop"
            alt="Design Moodboard"
          />
        </div>
      </section>

      {/* SECTION 3: BESTSELLERS */}
      <section className="home-bestsellers" style={{ padding: '100px 4%', width: '100%', boxSizing: 'border-box' }}>
        <div className="section-header-left" style={{ marginBottom: '40px' }}>
          <h2 className="section-main-title" style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: '2.8rem', color: '#333', marginBottom: '15px', fontWeight: 300 }}>
            Signature Collections
          </h2>
          <div className="collection-tabs" style={{ display: 'flex', gap: '30px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
            <span style={{ color: '#111', cursor: 'pointer', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
              MID SEASON REDUCTIONS
            </span>
            <span style={{ cursor: 'pointer' }}>BESTSELLERS</span>
            <span style={{ cursor: 'pointer' }}>NEW ARRIVALS</span>
          </div>
        </div>

        <div className="bestsellers-grid-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#fff' }}>
          <shopify-list-context id="bestsellers-list" type="product" query="products" first="4" onClick={handleProductCardClick}>
            <template dangerouslySetInnerHTML={{ __html: `
              <div class="leather-family-card pdp-related-card" shopify-attr--data-title="product.title">
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
                      <span class="price-old">₹44,600</span>
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
            `}} />
          </shopify-list-context>
        </div>

        <div className="slider-indicator" style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '400px', height: '1px', background: '#ddd', position: 'relative' }}>
            <div style={{ width: '10px', height: '10px', background: '#111', borderRadius: '50%', position: 'absolute', top: '-4.5px', left: '30%' }}></div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SPLIT FEATURE 50/50 */}
      <section className="home-split-feature" style={{ gap: '4px', padding: '4px 0', background: '#fff' }}>
        <div className="split-feature-item" onClick={() => navigate('/shop?category=hampers')} style={{ cursor: 'pointer' }}>
          <img
            className="split-feature-img"
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop"
            alt="Luxury Hampers"
          />
          <div className="split-feature-overlay"></div>
          <div className="split-feature-text">
            <h3>Luxury Hampers</h3>
            <p>
              Curate the perfect gifting experience with our premium, fully customizable hampers. Designed with exquisite
              details to reflect the joy and elegance of your most cherished celebrations.
            </p>
            <a href="#" className="discover-link" onClick={(e) => e.preventDefault()}>
              DISCOVER MORE &mdash;
            </a>
          </div>
        </div>
        <div className="split-feature-item" onClick={() => navigate('/shop?category=baskets')} style={{ cursor: 'pointer' }}>
          <img
            className="split-feature-img"
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&auto=format&fit=crop"
            alt="Bridal Trousseau"
          />
          <div className="split-feature-overlay"></div>
          <div className="split-feature-text">
            <h3>Bridal Trousseau</h3>
            <p>
              Preserve your most precious memories in our handcrafted trousseau trunks. Blending timeless traditions with
              contemporary luxury for the modern bride.
            </p>
            <a href="#" className="discover-link" onClick={(e) => e.preventDefault()}>
              DISCOVER MORE &mdash;
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: CATEGORIES */}
      <section className="home-categories">
        <div className="categories-header-left">
          <h2 className="section-main-title">Shop by Category</h2>
          <a
            href="#"
            className="discover-link-dark"
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
          >
            DISCOVER MORE &mdash;
          </a>
        </div>

        <div className="categories-slider-wrapper">
          <div className="categories-slider">
            <div className="category-slide-item" onClick={() => navigate('/shop?category=hampers')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop" alt="Luxury Hampers" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Hampers</p>
              </div>
            </div>
            <div className="category-slide-item" onClick={() => navigate('/shop?category=trays')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&auto=format&fit=crop" alt="Designer Platters" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Platters & Trays</p>
              </div>
            </div>
            <div className="category-slide-item" onClick={() => navigate('/shop?category=saree-covers')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop" alt="Saree Covers" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Saree Covers</p>
              </div>
            </div>
            <div className="category-slide-item" onClick={() => navigate('/shop?category=baskets')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1628149462104-e3dc122b5e28?w=800&auto=format&fit=crop" alt="Bridal Trunks" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Bridal Trunks</p>
              </div>
            </div>
            <div className="category-slide-item" onClick={() => navigate('/shop?category=bags')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&auto=format&fit=crop" alt="Potlis" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Embroidered Potlis</p>
              </div>
            </div>
            <div className="category-slide-item" onClick={() => navigate('/shop?category=bands')} style={{ cursor: 'pointer' }}>
              <div className="category-img-wrapper">
                <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop" alt="Jewelry Boxes" />
              </div>
              <div className="category-slide-details">
                <p className="category-product-title">Jewelry Boxes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="slider-indicator" style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '400px', height: '1px', background: '#999', position: 'relative' }}>
            <div style={{ width: '10px', height: '10px', background: '#111', borderRadius: '50%', position: 'absolute', top: '-4.5px', left: '0%' }}></div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CRAFTSMANSHIP SHOWCASE */}
      <section className="home-craftsmanship-banner">
        <div className="craftsmanship-bg-overlay"></div>
        <img
          className="craftsmanship-bg"
          src="https://images.unsplash.com/photo-1621607512214-68297480165e?w=2000&auto=format&fit=crop"
          alt="Handcrafted Details"
        />
        <div className="craftsmanship-overlay-text">
          <h2 className="section-main-title">Handcrafted in India</h2>
          <p>
            Every piece in our collection is meticulously handcrafted by skilled artisans. We blend traditional
            techniques with contemporary designs to create packaging that perfectly complements your most cherished
            moments.
          </p>
          <a href="#" className="discover-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
            DISCOVER MORE &mdash;
          </a>
        </div>
        <div className="craftsmanship-inset">
          <div className="inset-header">
            <a href="#" className="discover-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              DISCOVER MORE &mdash;
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542841791-1925b02a2bf5?w=400&auto=format&fit=crop"
            alt="Store Interior"
          />
        </div>
      </section>

      {/* SECTION 7: FEATURED STORY / PRODUCT SPLIT */}
      <section className="home-story-split">
        <div className="story-split-left">
          <img
            className="story-split-bg"
            src="https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=1000&auto=format&fit=crop"
            alt="Wedding Setup"
          />
        </div>
        <div className="story-split-right">
          <h2 className="section-main-title">THE WEDDING EDIT</h2>
          <p className="story-split-subtitle">Elevate your gifting experience</p>

          <div className="story-tabs">
            <span className={`story-tab ${trousseauFilter === 'all' ? 'active' : ''}`} onClick={() => setTrousseauFilter('all')}>BRIDAL ESSENTIALS</span>
            <span className={`story-tab ${trousseauFilter === 'basket' ? 'active' : ''}`} onClick={() => setTrousseauFilter('basket')}>CUSTOM HAMPERS</span>
            <span className={`story-tab ${trousseauFilter === 'tray' ? 'active' : ''}`} onClick={() => setTrousseauFilter('tray')}>RING PLATTERS</span>
          </div>

          <div className="story-slider-wrapper">
            <div className="story-slider">
              <shopify-list-context id="story-list" type="product" query="products" first="4" style={{ display: 'flex', gap: '4px' }} onClick={handleProductCardClick}>
                <template dangerouslySetInnerHTML={{ __html: `
                  <div class="leather-family-card pdp-related-card" style="width: 25vw; min-width: 250px; max-width: 320px;" shopify-attr--data-title="product.title">
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
                          <span class="price-old">₹44,600</span>
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
                `}} />
              </shopify-list-context>
            </div>
          </div>

          <div className="slider-indicator" style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ width: '100%', height: '1px', background: '#ddd', position: 'relative' }}>
              <div style={{ width: '10px', height: '10px', background: '#111', borderRadius: '50%', position: 'absolute', top: '-4.5px', left: '0%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: JOURNAL / BLOG */}
      <section className="home-journal">
        <div className="journal-header-left">
          <h2 className="section-main-title">Inspiration & Advice</h2>
          <div className="story-tabs">
            <span className="story-tab active">WEDDING TRENDS</span>
            <span className="story-tab">GIFTING GUIDES</span>
            <span className="story-tab">OUR CRAFT</span>
          </div>
        </div>

        <div className="journal-slider-wrapper">
          <div className="journal-slider">
            <div className="journal-slide-item" onClick={() => navigate('/blog/platter')} style={{ cursor: 'pointer' }}>
              <div className="journal-img-wrapper">
                <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop" alt="Wedding Trends" />
              </div>
              <div className="journal-slide-details">
                <p className="journal-date">OCTOBER 15, 2024</p>
                <h4 className="journal-title">The Art of Custom Gifting</h4>
              </div>
            </div>
            <div className="journal-slide-item" onClick={() => navigate('/blog/trends')} style={{ cursor: 'pointer' }}>
              <div className="journal-img-wrapper">
                <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop" alt="Bridal Preparation" />
              </div>
              <div className="journal-slide-details">
                <p className="journal-date">SEPTEMBER 28, 2024</p>
                <h4 className="journal-title">Trending Trousseau Themes</h4>
              </div>
            </div>
            <div className="journal-slide-item" onClick={() => navigate('/blog/beauty')} style={{ cursor: 'pointer' }}>
              <div className="journal-img-wrapper">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop" alt="Ring Platter" />
              </div>
              <div className="journal-slide-details">
                <p className="journal-date">SEPTEMBER 10, 2024</p>
                <h4 className="journal-title">Selecting the Perfect Ring Platter</h4>
              </div>
            </div>
            <div className="journal-slide-item" onClick={() => navigate('/blog/platter')} style={{ cursor: 'pointer' }}>
              <div className="journal-img-wrapper">
                <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop" alt="Wedding Planning" />
              </div>
              <div className="journal-slide-details">
                <p className="journal-date">AUGUST 22, 2024</p>
                <h4 className="journal-title">Planning Your Bridal Journey</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="slider-indicator" style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '400px', height: '1px', background: '#999', position: 'relative' }}>
            <div style={{ width: '10px', height: '10px', background: '#111', borderRadius: '50%', position: 'absolute', top: '-4.5px', left: '0%' }}></div>
          </div>
        </div>
      </section>

      {/* SECTION 9: PRE-FOOTER LANDSCAPE */}
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
