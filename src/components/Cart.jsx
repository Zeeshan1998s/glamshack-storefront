import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CartPairsSidebar from './CartPairsSidebar';

export default function Cart() {
  const cartRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    const cart = cartRef.current;
    if (!cart) return;

    const injectCartCSSAndSidebar = setInterval(() => {
      if (cart.shadowRoot) {
        const dialog = cart.shadowRoot.querySelector('dialog');

        // Inject stylesheet into cart's shadow root
        if (!cart.shadowRoot.getElementById('glamshack-custom-cart-css')) {
          const style = document.createElement('style');
          style.id = 'glamshack-custom-cart-css';
          style.textContent = `
            dialog {
              background-color: #f4f3ef !important;
              width: 450px !important;
              max-width: 90vw !important;
              height: 100vh !important;
              max-height: 100vh !important;
              min-height: 100vh !important;
              margin: 0 !important;
              padding: 0 !important;
              position: fixed !important;
              inset: 0 0 0 auto !important;
              border-radius: 0 !important;
              color: #12141d !important;
              overflow: visible !important;
            }
            #cart-pairs-sidebar {
               position: absolute !important;
               left: -400px !important;
               top: 0 !important;
               width: 400px !important;
               height: 100vh !important;
               background-color: #e0ded9 !important;
               display: flex !important;
               flex-direction: column !important;
               border-right: 1px solid #dcdacb !important;
               box-sizing: border-box !important;
               z-index: -1 !important;
               transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
            }
            dialog:not([open]) #cart-pairs-sidebar {
               transform: translateX(400px);
               opacity: 0;
            }
            .pairs-header {
               font-size: 0.75rem;
               color: #666;
               letter-spacing: 0.05em;
               padding: 32px 32px 16px 32px;
               font-family: 'Inter', sans-serif;
            }
            .pairs-content {
               padding: 0 32px 32px 32px;
               overflow-y: auto;
               flex-grow: 1;
               font-family: 'Inter', sans-serif;
            }
            .pairs-card {
               margin-bottom: 24px;
            }
            .pairs-card img {
               width: 100%;
               aspect-ratio: 1;
               object-fit: cover;
               background: #e2dfd8;
               margin-bottom: 12px;
            }
            .pairs-title {
               font-size: 0.85rem;
               color: #12141d;
               margin-bottom: 4px;
            }
            .pairs-price {
               font-size: 0.8rem;
               color: #cc0000;
               font-weight: 500;
               margin-bottom: 8px;
            }
            .pairs-add-btn {
               background: none;
               border: none;
               font-size: 0.75rem;
               color: #12141d;
               cursor: pointer;
               display: flex;
               align-items: center;
               gap: 4px;
               padding: 0;
            }
            .pairs-add-btn span {
               color: #999;
            }
          `;
          cart.shadowRoot.appendChild(style);
        }

        // Apply checkout button styles
        const styleCheckoutBtn = (el) => {
          if (el) {
            el.style.backgroundColor = '#4b5344';
            el.style.color = '#ffffff';
            el.style.borderRadius = '0';
            el.style.border = 'none';
            el.style.outline = 'none';
            el.style.boxShadow = 'none';
          }
        };

        styleCheckoutBtn(cart.shadowRoot.querySelector('[part="checkout-button"]'));
        const slot = cart.shadowRoot.querySelector('slot[name="checkout-button"]');
        if (slot && slot.parentElement) {
          styleCheckoutBtn(slot.parentElement);
        }

        const allInteractive = cart.shadowRoot.querySelectorAll('button, a, [role="button"]');
        allInteractive.forEach((btn) => {
          const txt = btn.textContent.toUpperCase();
          if (txt.includes('CHECKOUT SECURELY') || txt.includes('COMPLETE ORDER')) {
            styleCheckoutBtn(btn);
          }
        });

        // Set the portal container once the dialog is found in the shadow root
        if (dialog && !portalContainer) {
          setPortalContainer(dialog);
        }
      }
    }, 400);

    return () => clearInterval(injectCartCSSAndSidebar);
  }, [portalContainer]);

  return (
    <>
      {/* Render the Pairs sidebar inside the shadowRoot dialog using a React Portal */}
      {portalContainer && createPortal(
        <CartPairsSidebar />,
        portalContainer
      )}

      {/* Shopify Cart Component widget */}
      <shopify-cart id="cart" ref={cartRef}>
        <div
          slot="empty"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--accent-gold)' }}>👜</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: '#fff', fontStyle: 'italic' }}>
            Your bag is empty
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '8px', maxWidth: '240px', lineHeight: 1.5 }}>
            Explore our curated lines to add items to your cart.
          </p>
        </div>
        <div slot="checkout-button">CHECKOUT SECURELY</div>
      </shopify-cart>
    </>
  );
}
