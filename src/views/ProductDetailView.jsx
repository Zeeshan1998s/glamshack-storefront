import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductDetailView.css';

export default function ProductDetailView({
  onToggleWishlist
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productHandle = searchParams.get('handle') || 'luxurious-silver-gift-hamper-5';

  const variantIdParam = searchParams.get('variant');
  const fullVariantId = variantIdParam ? (variantIdParam.startsWith('gid://') ? variantIdParam : `gid://shopify/ProductVariant/${variantIdParam}`) : null;

  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productHandle]);

  // Observer to manage the custom image grid limit, counter, and active state
  useEffect(() => {
    const pdpContext = document.getElementById('pdp-context');
    if (!pdpContext) return;

    let expandedGrid = false;

    const syncCustomGrid = () => {
      const activeIdEl = pdpContext.querySelector('.pdp-current-variant-id');
      if (!activeIdEl) return;
      let activeId = activeIdEl.innerText.trim();

      // Fallback to URL if shopify-data hasn't resolved yet
      if (!activeId || activeId.includes('shopify-data')) {
        const params = new URLSearchParams(window.location.search);
        const vId = params.get('variant');
        if (vId) activeId = vId.includes('gid://') ? vId : `gid://shopify/ProductVariant/${vId}`;
      }

      const customGrid = pdpContext.querySelector('.custom-variant-grid');
      if (!customGrid) return;

      const items = Array.from(customGrid.querySelectorAll('.custom-variant-item'));
      if (items.length === 0) return;

      const LIMIT = 5;

      items.forEach((item, index) => {
        // Sync active styling by ID
        const id = item.getAttribute('data-variant-id');
        if (id && activeId && id === activeId) {
          item.style.borderColor = 'var(--text-main, #12141d)';
          item.style.borderWidth = '2px';
        } else {
          item.style.borderColor = 'var(--border-color, #eaeaea)';
          item.style.borderWidth = '1px';
        }

        // Handle Counter and Limit
        let overlay = item.querySelector('.counter-overlay');
        if (index >= LIMIT && !expandedGrid) {
          item.style.display = 'none';
        } else {
          item.style.display = 'block';
        }

        if (index === LIMIT - 1 && items.length > LIMIT && !expandedGrid) {
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'counter-overlay';
            overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; cursor: pointer;';
            overlay.innerText = `+${items.length - LIMIT + 1}`;

            overlay.onclick = (e) => {
              e.stopPropagation();
              e.preventDefault();
              expandedGrid = true;
              syncCustomGrid();
            };
            item.appendChild(overlay);
          }
        } else if (overlay) {
          overlay.remove();
        }
      });
    };

    const observer = new MutationObserver(() => syncCustomGrid());
    observer.observe(pdpContext, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [productHandle]);

  const handlePDPClick = (e) => {
    const target = e.target;

    // Intercept clicks on custom image variants to proxy click native Shopify radio inputs
    const customVariantItem = target.closest('.custom-variant-item');
    if (customVariantItem) {
      e.preventDefault();
      const variantTitle = customVariantItem.getAttribute('data-variant-title') || customVariantItem.getAttribute('shopify-attr--data-variant-title');
      if (variantTitle) {
        const variantSelector = document.querySelector('shopify-variant-selector');
        if (variantSelector && variantSelector.shadowRoot) {
          const options = variantTitle.split(' / ').map(s => s.trim());
          const inputs = variantSelector.shadowRoot.querySelectorAll('input[type="radio"], option');

          options.forEach(opt => {
            const input = Array.from(inputs).find(i => i.value === opt);
            if (input) {
              if (input.tagName === 'INPUT') {
                input.click();
              } else if (input.tagName === 'OPTION') {
                const select = input.closest('select');
                if (select) {
                  select.value = opt;
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
            }
          });
        }
      }
      return;
    }

    // Intercept clicks on media items to open full-screen modal
    const clickableImageContainer = target.closest('.pdp-media-item') || target.closest('.custom-variant-item');
    if (clickableImageContainer) {
      e.preventDefault();
      const img = clickableImageContainer.querySelector('img');
      if (img && img.src) {
        // Robustly remove Shopify's thumbnail sizing parameters to get the master high-res image
        let highResUrl = img.src;
        try {
          const urlObj = new URL(img.src);
          urlObj.searchParams.delete('width');
          urlObj.searchParams.delete('height');
          urlObj.searchParams.delete('crop');
          // Strip size suffixes like _60x60, _100x, _x100, _60x60_crop_center before the extension
          urlObj.pathname = urlObj.pathname.replace(/_(?:[0-9]+x[0-9]*|[0-9]*x[0-9]+)(?:_[a-z_]+)?(?=\.[a-zA-Z0-9]+$)/i, '');
          highResUrl = urlObj.toString();
        } catch (e) {
          // Fallback regex
          highResUrl = img.src.replace(/_(?:[0-9]+x[0-9]*|[0-9]*x[0-9]+)(?:_[a-z_]+)?(?=\.[a-zA-Z0-9]+$)/i, '');
        }
        setModalImage(highResUrl);
      }
      return;
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
              if (typeof cart.showModal === 'function') cart.showModal();
            }).catch(() => {
              if (typeof cart.showModal === 'function') cart.showModal();
            });
          } else {
            if (typeof cart.showModal === 'function') cart.showModal();
          }
        } catch (err) {
          console.error('Cart add error:', err);
        }
      }
      return;
    }

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
      const variantTitleEl = pdpWrapper.querySelector('.pdp-current-variant-title');
      const variantIdEl = pdpWrapper.querySelector('.pdp-current-variant-id');
      const variantName = variantTitleEl ? variantTitleEl.innerText.trim() : 'Standard';
      const vId = variantIdEl ? variantIdEl.innerText.trim() : title;

      if (title) {
        onToggleWishlist({
          id: vId || title,
          title,
          price,
          image: imgUrl,
          variant: variantName
        });
      }
    }

    // Let Shopify native logic handle Add to Cart!

    // Intercept clicks on related product cards
    const card = target.closest('.glam-card') || target.closest('.pdp-related-card');
    if (card) {
      const handle = card.getAttribute('data-handle') || card.getAttribute('shopify-attr--data-handle');
      const swatch = target.closest('.swatch');
      let vid = '';
      if (swatch) {
        vid = swatch.getAttribute('data-variant-id') || swatch.getAttribute('shopify-attr--data-variant-id');
      }
      if (handle) {
        e.preventDefault();
        navigate(`/product?handle=${handle}${vid ? `&variant=${vid}` : ''}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="view-product" className="page-view active-view">
      <div className="pdp-wrapper">
        {/* Back to shop navigation button */}
        <div className="container btn-back" style={{ paddingTop: '20px' }}>
          {/* <button className="btn-back" onClick={() => navigate('/shop')}>
            ← Back to Catalog
          </button> */}
        </div>

        {/* Dynamic Product Context for Detail Page */}
        <shopify-context
          key={productHandle}
          id="pdp-context"
          type="product"
          handle={productHandle}
          variant={fullVariantId || undefined}
          onClick={handlePDPClick}
        >
          <template dangerouslySetInnerHTML={{
            __html: `
            <div class="pdp-layout-new">
              <!-- TOP SECTION -->
              <div class="pdp-top-section">
                <div class="pdp-media-grid">
                  <shopify-list-context type="variant" query="product.variants" first="20" style="display: contents;">
                    <template>
                      <div class="pdp-media-item" shopify-attr--data-variant-id="variant.id" style="cursor: pointer;">
                        <shopify-media width="800" height="800" query="variant.image"></shopify-media>
                      </div>
                    </template>
                  </shopify-list-context>
                </div>

                <div class="pdp-info-sticky-wrapper">
                  <div class="pdp-info-sticky">
                    <div class="pdp-breadcrumb">
                      HOME / PRODUCTS / <span class="pdp-title-breadcrumb" style="text-transform: uppercase;"><shopify-data query="product.title"></shopify-data></span>
                    </div>
                    <h1 class="pdp-title"><shopify-data query="product.title"></shopify-data></h1>
                    <div class="pdp-price"><shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></div>

                    <div class="pdp-actions" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                      <!-- VARIANT SELECTOR -->
                      <div class="pdp-variant-selector" style="margin-bottom: 24px; padding-bottom: 24px;">
                        <span class="color-label" style="display: flex; align-items: center; gap: 10px; font-size: 11.2px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-main, #12141d); margin-bottom: 16px;">
                          Select Variant: <span class="pdp-visible-variant-title" style="color: var(--text-muted, #767676);"><shopify-data query="product.selectedOrFirstAvailableVariant.title"></shopify-data></span>
                        </span>
                        
                        <!-- CUSTOM IMAGE-BASED VARIANT GRID -->
                        <div class="custom-variant-grid" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;">
                          <shopify-list-context type="variant" query="product.variants" first="20" style="display: contents;">
                            <template>
                              <div class="custom-variant-item" shopify-attr--data-variant-title="variant.title" shopify-attr--data-variant-id="variant.id" style="width: 70px; height: 70px; border: 1px solid var(--border-color, #eaeaea); border-radius: 4px; cursor: pointer; overflow: hidden; position: relative; padding: 2px; box-sizing: border-box; transition: border-color 0.2s;">
                                <shopify-media query="variant.image" width="70" height="70" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 2px;"></shopify-media>
                              </div>
                            </template>
                          </shopify-list-context>
                        </div>

                        <!-- HIDDEN NATIVE VARIANT SELECTOR -->
                        <div style="display: none;">
                          <shopify-variant-selector></shopify-variant-selector>
                        </div>
                      </div>

                      <span class="pdp-current-variant-id" style="display: none;"><shopify-data query="product.selectedOrFirstAvailableVariant.id"></shopify-data></span>
                      <span class="pdp-current-variant-title" style="display: none;"><shopify-data query="product.selectedOrFirstAvailableVariant.title"></shopify-data></span>

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
                    <shopify-list-context type="image" query="product.images" first="3" style="display: contents;">
                      <template>
                        <shopify-media width="100" height="100" query="image"></shopify-media>
                      </template>
                    </shopify-list-context>
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
              <div class="pdp-related-section" style="max-width: 100%; padding: 100px 4%; width: 100%; box-sizing: border-box;  padding-top: 0;">
                <h2 class="section-main-title" style="font-family: var(--font-display), 'Playfair Display', serif; font-size: 36px; color: #3F4234E5; margin-bottom: 40px; font-weight: 500;">YOU MIGHT ALSO LIKE</h2>
                <div class="pdp-related-grid-wrapper" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; max-width: 100%;">
                  <shopify-list-context type="product" query="products" first="4">
                    <template>
                      <div class="leather-family-card pdp-related-card" shopify-attr--data-handle="product.handle" shopify-attr--data-title="product.title" style="cursor: pointer;">
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
                              <shopify-list-context type="variant" query="product.variants" first="3">
                                <template>
                                  <div class="swatch" shopify-attr--data-variant-id="variant.id">
                                    <shopify-media width="50" height="50" query="variant.image"></shopify-media>
                                  </div>
                                </template>
                              </shopify-list-context>
                              <span class="swatch-plus">+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </shopify-list-context>
                </div>
              </div>
            </div>
          `}} />


          <div shopify-loading-placeholder="" style={{ textAlign: 'center', padding: '100px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Retrieving details...
            </p>
          </div>
        </shopify-context>
      </div>

      <section className="home-craftsmanship-banner">
        <div className="craftsmanship-bg-overlay"></div>
        <img
          className="craftsmanship-bg"
          src="https://images.unsplash.com/photo-1621607512214-68297480165e?w=2000&auto=format&fit=crop"
          alt="Handcrafted Details"
        />
        <div className="craftsmanship-overlay-text">
          <h2 className="section-main-handcrafted">Handcrafted in India</h2>
          <p className="craftsmanship-description">
            Every piece in our collection is meticulously handcrafted by skilled artisans. We blend traditional
            techniques with contemporary designs to create packaging that perfectly complements your most cherished
            moments.
          </p>
          <a href="#" className="discover-link split-feature-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
            DISCOVER MORE &mdash;
          </a>
        </div>
        {/* <div className="craftsmanship-inset">
          <div className="inset-header">
            <a href="#" className="discover-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              DISCOVER MORE &mdash;
            </a>
          </div>
        {/* FULL SCREEN IMAGE MODAL */}
        {modalImage && (
          <div
            className="pdp-image-modal"
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out', opacity: 1, transition: 'opacity 0.3s ease'
            }}
            onClick={() => setModalImage(null)}
          >
            <button
              style={{
                position: 'absolute', top: '30px', right: '40px', background: 'transparent',
                border: 'none', color: '#fff', fontSize: '40px', cursor: 'pointer', zIndex: 10000,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={(e) => { e.stopPropagation(); setModalImage(null); }}
            >
              &times;
            </button>
            <img
              src={modalImage}
              alt="Full view"
              style={{
                maxWidth: '90%', maxHeight: '90%', objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)', borderRadius: '8px',
                transform: 'scale(1)', transition: 'transform 0.3s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </section>
    </div>
  );
}
