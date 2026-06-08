import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductDetailView.css';

export default function ProductDetailView({
  onToggleWishlist
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productHandle = searchParams.get('handle') || 'luxurious-silver-gift-hamper-5';

  const handlePDPClick = (e) => {
    const target = e.target;
    
    // Intercept clicks on the wishlist button
    const wishlistBtn = target.closest('.btn-wishlist-toggle-pdp');
    if (wishlistBtn) {
      e.preventDefault();
      const pdpWrapper = target.closest('.pdp-layout-new');
      if (!pdpWrapper) return;

      const titleEl = pdpWrapper.querySelector('.pdp-title');
      const priceEl = pdpWrapper.querySelector('.pdp-price');
      
      let imgUrl = '';
      const firstMediaItem = pdpWrapper.querySelector('.pdp-media-item');
      if (firstMediaItem) {
        const img = firstMediaItem.querySelector('img');
        if (img) imgUrl = img.src;
      }

      const title = titleEl ? titleEl.innerText.trim() : '';
      const price = priceEl ? priceEl.innerText.trim() : '';

      if (title) {
        onToggleWishlist({
          id: title,
          title,
          price,
          image: imgUrl,
          variant: 'Standard'
        });
      }
    }

    // Intercept clicks on the add to cart button
    const addToCartBtn = target.closest('.btn-add-to-cart-new');
    if (addToCartBtn) {
      e.preventDefault();
      const cart = document.getElementById('cart');
      if (cart && typeof cart.addLine === 'function') {
        try {
          const res = cart.addLine(e.nativeEvent);
          if (res && typeof res.then === 'function') {
            res.then(() => {
              if (typeof cart.showModal === 'function') {
                cart.showModal();
              }
            }).catch(() => {
              if (typeof cart.showModal === 'function') {
                cart.showModal();
              }
            });
          } else {
            if (typeof cart.showModal === 'function') {
              cart.showModal();
            }
          }
        } catch (err) {
          console.error('Error adding item to cart:', err);
          if (cart && typeof cart.showModal === 'function') {
            cart.showModal();
          }
        }
      }
    }

    // Intercept clicks on related product cards
    const card = target.closest('.glam-card');
    if (card) {
      const handle = card.getAttribute('data-handle') || card.getAttribute('shopify-attr--data-handle');
      if (handle) {
        e.preventDefault();
        navigate(`/product?handle=${handle}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="view-product" className="page-view active-view">
      <div className="pdp-wrapper">
        {/* Back to shop navigation button */}
        <div className="container" style={{ paddingTop: '20px' }}>
          <button className="btn-back" onClick={() => navigate('/shop')}>
            ← Back to Catalog
          </button>
        </div>

        {/* Dynamic Product Context for Detail Page */}
        <shopify-context
          key={productHandle}
          id="pdp-context"
          type="product"
          handle={productHandle}
          onClick={handlePDPClick}
        >
          <template dangerouslySetInnerHTML={{ __html: `
            <div class="pdp-layout-new">
              <!-- TOP SECTION -->
              <div class="pdp-top-section">
                <div class="pdp-media-grid">
                  <div class="pdp-media-item">
                    <shopify-media width="800" height="800" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                  </div>
                  <div class="pdp-media-item">
                    <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&amp;auto=format&amp;fit=crop" style="width:100%; height:100%; object-fit:cover;" alt="Detail" />
                  </div>
                  <div class="pdp-media-item">
                    <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&amp;auto=format&amp;fit=crop" style="width:100%; height:100%; object-fit:cover;" alt="Detail" />
                  </div>
                  <div class="pdp-media-item">
                    <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&amp;auto=format&amp;fit=crop" style="width:100%; height:100%; object-fit:cover;" alt="Detail" />
                  </div>
                </div>

                <div class="pdp-info-sticky-wrapper">
                  <div class="pdp-info-sticky">
                    <div class="pdp-breadcrumb">
                      HOME / PRODUCTS / <span style="text-transform: uppercase;"><shopify-data query="product.title"></shopify-data></span>
                    </div>
                    <h1 class="pdp-title"><shopify-data query="product.title"></shopify-data></h1>
                    <div class="pdp-price"><shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></div>

                    <div class="pdp-actions" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                      <button class="btn-add-to-cart-new" shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale">
                        ADD TO BAG
                      </button>
                      <button class="btn-wishlist-toggle-pdp" style="background: transparent; border: 1px solid var(--text-main); color: var(--text-main); padding: 12px 24px; font-family: var(--font-body); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease;">
                        ♡ ADD TO WISHLIST
                      </button>
                    </div>

                    <ul class="pdp-features-list">
                      <li><span class="icon">⚲</span> Complimentary shipping and returns</li>
                      <li><span class="icon">☼</span> Handcrafted using premium materials</li>
                      <li><span class="icon">↻</span> 1-year global warranty included</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- MIDDLE 1: INFO SECTION -->
              <div class="pdp-info-section pdp-container">
                <div class="pdp-quote-box">
                  <h2 class="quote-text">Why you choose us. I do that style and brand that you'll go your own way in life.</h2>
                  <div class="quote-subtext">
                    <p>Our goal is to create products that are timeless, functional, and durable. We source the finest materials and partner with ethical factories to bring you the highest quality pieces.</p>
                    <p>Whether you're commuting to work, traveling the world, or just running errands around town, our accessories are designed to keep up with your busy lifestyle while making a statement.</p>
                  </div>
                  <div class="quote-thumbnails">
                    <shopify-media width="100" height="100" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                    <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&amp;auto=format&amp;fit=crop" style="width:100px; height:100px; object-fit:cover;" alt="Detail Thumbnail" />
                  </div>
                </div>

                <div class="pdp-accordion-box">
                  <div class="pdp-accordion">
                    <details open="">
                      <summary>Details and Care</summary>
                      <div class="details-content">
                        <shopify-data query="product.descriptionHtml"></shopify-data>
                      </div>
                    </details>
                    <details>
                      <summary>Shipping Info</summary>
                      <div class="details-content">
                        <p>Complimentary signature shipping on all orders over $50. Returns are accepted within 30 days of delivery for fully unused products in their original packaging.</p>
                      </div>
                    </details>
                    <details>
                      <summary>Warranty</summary>
                      <div class="details-content">
                        <p>All our products come with a 1-year global warranty covering manufacturing defects.</p>
                      </div>
                    </details>
                    <details>
                      <summary>Contact Us</summary>
                      <div class="details-content">
                        <p>Email: support@glamshack.com<br />Phone: 1-800-GLAMSHK</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              <!-- MIDDLE 2: STYLING -->
              <div class="pdp-styling-section">
                <div class="pdp-container">
                  <h3 class="section-heading">STYLING</h3>
                </div>
                <div class="styling-grid">
                  <div class="styling-item">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&amp;auto=format&amp;fit=crop" alt="Styling 1" />
                    <div class="styling-caption">
                      <h4>Look 1</h4>
                      <p>Casual everyday aesthetic.</p>
                    </div>
                  </div>
                  <div class="styling-item">
                    <img src="https://images.unsplash.com/photo-1515347619252-8bf8841e06c5?w=600&amp;auto=format&amp;fit=crop" alt="Styling 2" />
                    <div class="styling-caption">
                      <h4>Look 2</h4>
                      <p>Weekend brunch ready.</p>
                    </div>
                  </div>
                  <div class="styling-item">
                    <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&amp;auto=format&amp;fit=crop" alt="Styling 3" />
                    <div class="styling-caption">
                      <h4>Look 3</h4>
                      <p>Travel and airport style.</p>
                    </div>
                  </div>
                  <div class="styling-item">
                    <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&amp;auto=format&amp;fit=crop" alt="Styling 4" />
                    <div class="styling-caption">
                      <h4>Look 4</h4>
                      <p>Evening and formal outings.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MIDDLE 3: WEAR THIS -->
              <div class="pdp-wear-this-section">
                <div class="wear-this-left">
                  <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&amp;auto=format&amp;fit=crop" alt="Wear This" />
                </div>
                <div class="wear-this-right">
                  <div class="wear-this-right-content">
                    <h3 class="section-heading-serif">What's That?</h3>
                    <p class="wear-this-desc">Pair your selection with our signature accessories to complete the look.</p>
                    <div class="wear-this-products">
                      <div class="wear-this-card">
                        <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&amp;auto=format&amp;fit=crop" alt="Wear Detail 1" />
                        <div class="wear-this-card-info">
                          <span>Cardholder Styling</span>
                          <span style="font-size: 0.8em; color: #666;">Inspiration</span>
                        </div>
                      </div>
                      <div class="wear-this-card">
                        <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&amp;auto=format&amp;fit=crop" alt="Wear Detail 2" />
                        <div class="wear-this-card-info">
                          <span>Wallet Styling</span>
                          <span style="font-size: 0.8em; color: #666;">Inspiration</span>
                        </div>
                      </div>
                    </div>
                    <ul class="wear-this-list">
                      <li>01 / Hand stitched details</li>
                      <li>02 / Premium brass hardware</li>
                      <li>03 / Water resistant lining</li>
                      <li>04 / Built for longevity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- BOTTOM: YOU MIGHT ALSO LIKE -->
              <div class="pdp-related-section container">
                <h3 class="section-heading-small">YOU MIGHT ALSO LIKE</h3>
                <div class="pdp-related-grid-wrapper">
                  <shopify-list-context type="product" query="products" first="4">
                    <template>
                      <div class="glam-card pdp-specific-related-card" shopify-attr--data-handle="product.handle" shopify-attr--data-title="product.title" style="cursor: pointer;">
                        <div class="card-media-wrapper" style="background: #f4f3ef;">
                          <shopify-media width="300" height="300" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                        </div>
                        <div class="card-details" style="padding-top: 10px; text-align: left;">
                          <h3 class="card-title" style="margin:0;"><shopify-data query="product.title"></shopify-data></h3>
                          <div class="card-price" style="margin-top: 4px; color: var(--accent-red); font-weight: 600;">
                            <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
                          </div>
                        </div>
                      </div>
                    </template>
                  </shopify-list-context>
                </div>
              </div>
            </div>
          `}} />
          <div shopify-loading-placeholder="" style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Retrieving details...
            </p>
          </div>
        </shopify-context>
      </div>
    </div>
  );
}
