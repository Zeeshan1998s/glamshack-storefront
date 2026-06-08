import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchDrawer from './components/SearchDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import Cart from './components/Cart';

import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import BlogView from './views/BlogView';
import ArticleDetailView from './views/ArticleDetailView';

import './index.css';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('glamshack_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Update Shopify Cart item count badge
  const updateCartBadge = () => {
    const cartEl = document.getElementById('cart');
    if (!cartEl) return;
    const lines = cartEl.lines || cartEl.lineItems || (cartEl.cart && cartEl.cart.lines) || [];
    let count = 0;
    if (Array.isArray(lines)) {
      count = lines.reduce((total, line) => total + (line.quantity || 0), 0);
    } else if (typeof lines === 'number') {
      count = lines;
    }
    setCartCount(count);
  };

  // Sync cart badge based on user click interactions or storage updates
  useEffect(() => {
    const handleGlobalClick = () => {
      setTimeout(updateCartBadge, 800);
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('storage', updateCartBadge);

    // Run initial badge count lookup
    setTimeout(updateCartBadge, 1500);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('storage', updateCartBadge);
    };
  }, []);

  // Periodically scrape catalog items to feed Search Suggestions drawer
  useEffect(() => {
    const gatherProducts = () => {
      const cards = document.querySelectorAll('.glam-card, .leather-family-card');
      const products = [];
      const seenKeys = new Set();

      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).trim();
        const productId = card.getAttribute('shopify-attr--data-id') || card.getAttribute('data-id');
        const dedupeKey = productId || title;

        if (title && !seenKeys.has(dedupeKey)) {
          seenKeys.add(dedupeKey);
          const price = card.querySelector('.card-price, .price-new')?.innerText || '';
          const originalMedia = card.querySelector('shopify-media');
          const originalImg = originalMedia ? originalMedia.querySelector('img') : card.querySelector('img');
          const imageSrc = originalImg ? originalImg.src : '';

          products.push({
            title,
            price,
            imageSrc,
            originalCard: card
          });
        }
      });

      if (products.length > 0) {
        setAllProducts(products);
      }
    };

    const interval = setInterval(gatherProducts, 1500);
    return () => clearInterval(interval);
  }, []);

  // Wishlist actions
  const handleToggleWishlist = (product) => {
    let updated;
    const exists = wishlist.some((item) => item.title.toLowerCase() === product.title.toLowerCase());
    if (exists) {
      updated = wishlist.filter((item) => item.title.toLowerCase() !== product.title.toLowerCase());
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('glamshack_wishlist', JSON.stringify(updated));
    setIsWishlistOpen(true); // Open drawer on addition/removal
  };

  const handleRemoveWishlistItem = (idOrTitle) => {
    const updated = wishlist.filter(
      (item) => item.id !== idOrTitle && item.title !== idOrTitle
    );
    setWishlist(updated);
    localStorage.setItem('glamshack_wishlist', JSON.stringify(updated));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    localStorage.setItem('glamshack_wishlist', JSON.stringify([]));
  };

  const handleMoveAllWishlistToBag = () => {
    if (wishlist.length === 0) return;
    const cart = document.getElementById('cart');
    if (!cart || !cart.addLine) return;

    alert('Adding wishlist items to cart. (Requires backend product variant mappings)');
    handleClearWishlist();
    setIsWishlistOpen(false);
    handleOpenCart();
  };

  const handleOpenCart = () => {
    const cart = document.getElementById('cart');
    if (cart && typeof cart.showModal === 'function') {
      cart.showModal();
    }
  };

  return (
    <>
      {/* Shopify Configuration Context */}
      <shopify-store
        store-domain="tbxtcm-tf.myshopify.com"
        public-access-token="a3347112f66392d3099d47bc3d451bae"
        country="US"
        language="en"
      ></shopify-store>

      {/* Global Header */}
      <Header
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={handleOpenCart}
      />

      {/* Declarative View Routing Configuration */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/shop" element={<ShopView />} />
        <Route path="/product" element={<ProductDetailView onToggleWishlist={handleToggleWishlist} />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/blog" element={<BlogView />} />
        <Route path="/blog/:articleKey" element={<ArticleDetailView />} />
      </Routes>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Drawers & Overlays */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allProducts={allProducts}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveItem={handleRemoveWishlistItem}
        onClearWishlist={handleClearWishlist}
        onMoveAllToBag={handleMoveAllWishlistToBag}
        onOpenCart={handleOpenCart}
      />

      {/* Modular Shopify Shopping Cart widget */}
      <Cart />
    </>
  );
}
