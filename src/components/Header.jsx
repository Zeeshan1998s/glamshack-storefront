import React from 'react';
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

  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault();
    navigate(`/shop?category=${categoryId}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="top-banner">
        FREE SHIPPING ON ORDERS ABOVE Rs. 5000 | 100% HANDCRAFTED LUXURY PACKAGING
      </div>

      <header>
        <div className="container header-single-row">
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
                    <a
                      href="#"
                      className={`cat-nav-link ${location.search.includes(`category=${item.id}`) ? 'active' : ''}`}
                      role="button"
                      onClick={(e) => handleCategoryClick(e, item.id)}
                    >
                      {item.label}
                    </a>
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
      </header>
    </>
  );
}
