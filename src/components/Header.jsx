import  { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const NAV_ITEMS = [
  { id: 'hampers', label: 'HAMPERS' },
  { id: 'trays', label: 'TRAYS' },
  { id: 'saree-covers', label: 'SAREE COVERS' },
  { id: 'bags', label: 'BAGS' },
  { id: 'baskets', label: 'BASKET / TRUNKS' },
  { id: 'pouches', label: 'POUCHES' },
  { id: 'bands', label: 'BANDS' }
];

export default function Header({
  cartCount,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="top-banner">
        FREE SHIPPING ON ORDERS ABOVE Rs. 5000 | 100% HANDCRAFTED LUXURY PACKAGING
      </div>

      <header>
        {/* Desktop Header Row */}
        <div className="container header-single-row desktop-only-header">
          {/* Left side: Links and Search */}
          <div className="header-left-group">
            <nav className="category-nav">
              <ul className="category-nav-list">
                <li>
                  <Link
                    to="/home"
                    className={`cat-nav-link ${isActive('/home') ? 'active' : ''}`}
                  >
                    HOME
                  </Link>
                </li>
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/shop?category=${item.id}`}
                      className={`cat-nav-link ${location.search.includes(`category=${item.id}`) ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/blog"
                    className={`cat-nav-link ${isActive('/blog') ? 'active' : ''}`}
                  >
                    JOURNAL
                  </Link>
                </li>
              </ul>
            </nav>
            <button
              className="header-icon-btn search-btn"
              onClick={onOpenSearch}
              title="Search Catalog"
            >
              🔍
            </button>
          </div>

          {/* Right side: Actions & Logo */}
          <div className="header-right-group">
            <Link
              to="/about"
              className={`top-util-link ${isActive('/about') ? 'active' : ''}`}
            >
              ABOUT US
            </Link>
            <span className="currency-label">INR</span>
            <button
              className="header-icon-btn profile-btn"
              onClick={() => navigate('/profile')}
              title="My Profile"
            >
              👤
            </button>
            <button
              className="header-icon-btn wishlist-btn"
              onClick={onOpenWishlist}
              title="Wishlist"
            >
              🤍
            </button>
            <button className="btn-open-cart" onClick={onOpenCart}>
              🛍️
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
            <Link
              to="/home"
              className="logo"
            >
              GLAMSHACK
            </Link>
          </div>
        </div>

        {/* Mobile Header Row */}
        <div className="container header-single-row mobile-only-header">
          {/* Left side: Hamburger */}
          <button
            className="header-icon-btn mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            title="Open Menu"
          >
            ☰
          </button>

          {/* Center: Logo */}
          <div className="mobile-logo-wrapper">
            <Link
              to="/home"
              className="logo"
            >
              GLAMSHACK
            </Link>
          </div>

          {/* Right side: Search, Wishlist, Cart */}
          <div className="header-right-group">
            <button
              className="header-icon-btn search-btn"
              onClick={onOpenSearch}
              title="Search Catalog"
            >
              🔍
            </button>
            <button
              className="header-icon-btn wishlist-btn"
              onClick={onOpenWishlist}
              title="Wishlist"
            >
              🤍
            </button>
            <button className="btn-open-cart" onClick={onOpenCart}>
              🛍️
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <Link to="/home" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
              GLAMSHACK
            </Link>
            <button className="mobile-nav-close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
          </div>
          <div className="mobile-nav-divider"></div>
          <ul className="mobile-nav-links">
            <li>
              <Link to="/home" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                HOME
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/shop?category=${item.id}`}
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                JOURNAL
              </Link>
            </li>
            <div className="mobile-nav-divider"></div>
            <li>
              <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                ABOUT US
              </Link>
            </li>
            <li>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                MY PROFILE 👤
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
