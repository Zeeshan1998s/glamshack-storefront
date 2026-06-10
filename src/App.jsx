import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const SHOPIFY_URL = 'https://tbxtcm-tf.myshopify.com/api/2023-07/graphql.json';
const PUBLIC_TOKEN = 'a3347112f66392d3099d47bc3d451bae';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [customer, setCustomer] = useState(() => {
    const demoUser = localStorage.getItem('glamshack_demo_user');
    return demoUser ? JSON.parse(demoUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('glamshack_customer_token');
    const demoUser = localStorage.getItem('glamshack_demo_user');
    return !!(token || demoUser);
  });
  const [authLoading, setAuthLoading] = useState(() => {
    const token = localStorage.getItem('glamshack_customer_token');
    return !!token;
  });

  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('glamshack_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const fetchCustomerData = async (token) => {
    const response = await fetch(SHOPIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
      },
      body: JSON.stringify({
        query: `
          query getCustomer($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              firstName
              lastName
              email
              phone
              defaultAddress {
                formatted
                city
                country
              }
              orders(first: 5) {
                edges {
                  node {
                    orderNumber
                    processedAt
                    totalPrice {
                      amount
                      currencyCode
                    }
                    fulfillmentStatus
                  }
                }
              }
            }
          }
        `,
        variables: { customerAccessToken: token }
      })
    });

    const res = await response.json();
    if (res.errors || !res.data || !res.data.customer) {
      throw new Error(res.errors ? res.errors[0].message : 'Customer profile not found.');
    }
    return res.data.customer;
  };

  

  const handleLogout = () => {
    localStorage.removeItem('glamshack_customer_token');
    localStorage.removeItem('glamshack_demo_user');
    setCustomer(null);
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = async (token) => {
    localStorage.setItem('glamshack_customer_token', token);
    const data = await fetchCustomerData(token);
    setCustomer(data);
    setIsLoggedIn(true);
    return data;
  };

  const handleDemoLogin = (mockUser) => {
    localStorage.setItem('glamshack_demo_user', JSON.stringify(mockUser));
    setCustomer(mockUser);
    setIsLoggedIn(true);
  };

  // Read current cart count from Shopify component state
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

  useEffect(() => {
    const token = localStorage.getItem('glamshack_customer_token');
    
    if (token) {
      fetchCustomerData(token)
        .then((data) => {
          setCustomer(data);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error('Failed to load customer profile on mount:', err);
          handleLogout();
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, []);

  // Performant targeted MutationObserver for cart badge sync
  useEffect(() => {
    const cartEl = document.getElementById('cart');
    if (!cartEl) return;

    // Observe changes inside the shopify-cart element to sync items count
    const observer = new MutationObserver(() => {
      updateCartBadge();
    });

    observer.observe(cartEl, {
      attributes: true,
      childList: true,
      subtree: true
    });

    // Initial sync
    setTimeout(updateCartBadge, 1000);

    return () => observer.disconnect();
  }, []);

  // Sync cart across browser tabs via storage events
  useEffect(() => {
    window.addEventListener('storage', updateCartBadge);
    return () => window.removeEventListener('storage', updateCartBadge);
  }, []);

  // Handle legacy hash routing migration (e.g. /#/home -> /home, or /home#/home -> /home)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      const cleanPath = hash.substring(1);
      window.history.replaceState(null, '', cleanPath);
    }
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
        isLoggedIn={isLoggedIn}
        customer={customer}
        onLogout={handleLogout}
        onDemoLogin={handleDemoLogin}
      />

      {/* Declarative View Routing Configuration */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/shop" element={<ShopView />} />
        <Route path="/product" element={<ProductDetailView onToggleWishlist={handleToggleWishlist} />} />
        <Route path="/profile" element={
          <ProfileView 
            mode="profile" 
            customer={customer}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLoginSuccess={handleLoginSuccess}
            onDemoLogin={handleDemoLogin}
            authLoading={authLoading}
          />
        } />
        <Route path="/login" element={
          <ProfileView 
            mode="login" 
            customer={customer}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLoginSuccess={handleLoginSuccess}
            onDemoLogin={handleDemoLogin}
            authLoading={authLoading}
          />
        } />
        <Route path="/register" element={
          <ProfileView 
            mode="register" 
            customer={customer}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLoginSuccess={handleLoginSuccess}
            onDemoLogin={handleDemoLogin}
            authLoading={authLoading}
          />
        } />
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

      {/* Modular Shopify Shopping Cart component */}
      <Cart />
    </>
  );
}
