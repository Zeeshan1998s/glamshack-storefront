import React, { useState, useEffect } from 'react';

export default function CartPairsSidebar() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const populatePairs = () => {
      // Find cards in the page to extract products
      const cards = document.querySelectorAll('.glam-card, .leather-family-card');
      const products = [];
      const seen = new Set();

      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).trim();
        const price = card.querySelector('.card-price, .price-new')?.innerText || '';
        const originalMedia = card.querySelector('shopify-media');
        const originalImg = originalMedia ? originalMedia.querySelector('img') : card.querySelector('img');
        const imgSrc = originalImg ? originalImg.src : '';

        if (title && imgSrc && !seen.has(title)) {
          seen.add(title);
          products.push({ title, price, imgSrc, originalCard: card });
        }
      });

      if (products.length >= 2) {
        setRecommendations(products.slice(0, 3));
      } else {
        // Fallbacks if products aren't loaded yet
        setRecommendations([
          {
            title: "Orange Woven Handbag",
            price: "₹14,500",
            imgSrc: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300"
          },
          {
            title: "Quilted Crossbody Bag",
            price: "₹22,900",
            imgSrc: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300"
          },
          {
            title: "Premium Wine Box Set",
            price: "₹5,400",
            imgSrc: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=300"
          }
        ]);
      }
    };

    // Run initially and set an interval to check for loaded items
    populatePairs();
    const interval = setInterval(populatePairs, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAdd = (product, e) => {
    e.preventDefault();
    const btn = e.currentTarget;

    // Search for original card to trigger add line
    let originalCard = product.originalCard;
    if (!originalCard) {
      const cards = document.querySelectorAll('.glam-card, .leather-family-card');
      for (const card of cards) {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).trim();
        if (title.toLowerCase() === product.title.toLowerCase()) {
          originalCard = card;
          break;
        }
      }
    }

    if (originalCard) {
      const tempAddBtn = document.createElement('button');
      tempAddBtn.style.display = 'none';
      tempAddBtn.onclick = (evt) => {
        const cart = document.getElementById('cart');
        if (cart && cart.addLine) {
          cart.addLine(evt);
        }
      };
      originalCard.appendChild(tempAddBtn);
      tempAddBtn.click();
      tempAddBtn.remove();

      btn.innerHTML = 'ADDED <span>✓</span>';
      setTimeout(() => {
        btn.innerHTML = 'ADD <span>—</span>';
      }, 2000);
    } else {
      // Direct checkout fallback or alert if not found
      const cart = document.getElementById('cart');
      if (cart && cart.addLine) {
        cart.addLine(e);
      }
    }
  };

  return (
    <div id="cart-pairs-sidebar">
      <div className="pairs-header">PAIRS WITH...</div>
      <div className="pairs-content">
        {recommendations.map((prod, idx) => (
          <div key={idx} className="pairs-card">
            <img src={prod.imgSrc} alt={prod.title} />
            <div className="pairs-info">
              <div className="pairs-title">{prod.title}</div>
              <div className="pairs-price">{prod.price}</div>
              <button className="pairs-add-btn" onClick={(e) => handleAdd(prod, e)}>
                ADD <span>—</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
