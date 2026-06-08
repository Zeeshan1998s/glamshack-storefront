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
  onOpenCart,
  isLoggedIn,
  customer,
  onLogout,
  onDemoLogin
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getInitials = () => {
    if (!customer) return 'U';
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
    }
    return customer.email?.[0]?.toUpperCase() || 'U';
  };

  const handleHeaderDemoSignIn = () => {
    const mockUser = {
      firstName: 'Zeeshan',
      lastName: 'Hanif',
      email: 'zeeshanze19@gmail.com',
      phone: '+91 99999 88888',
      membershipTier: 'VIP Platinum',
      pointsBalance: '1,240 pts',
      defaultAddress: {
        formatted: ['Lucknow, Uttar Pradesh, India'],
        city: 'Lucknow',
        country: 'India'
      },
      orders: {
        edges: [
          {
            node: {
              orderNumber: 2847,
              processedAt: new Date(2026, 9, 24).toISOString(),
              totalPrice: { amount: '185.00', currencyCode: 'USD' },
              fulfillmentStatus: 'IN_TRANSIT'
            }
          }
        ]
      }
    };
    onDemoLogin(mockUser);
  };

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
            <div className="profile-menu-container">
              {isLoggedIn && customer ? (
                <button
                  className="header-avatar-btn"
                  onClick={() => navigate('/profile')}
                  title="My Profile"
                >
                  {getInitials()}
                </button>
              ) : (
                <button
                  className="header-icon-btn profile-btn"
                  onClick={() => navigate('/login')}
                  title="Log In / Register"
                >
                  👤
                </button>
              )}
              
              <div className="profile-dropdown-menu">
                {isLoggedIn && customer ? (
                  <>
                    <div className="dropdown-user-info">
                      <span className="dropdown-welcome">Welcome,</span>
                      <span className="dropdown-username">{customer.firstName || 'Client'}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">My Account</Link>
                    <button onClick={onLogout} className="dropdown-item dropdown-btn">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item">Log In</Link>
                    <Link to="/register" className="dropdown-item">Create Account</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleHeaderDemoSignIn} className="dropdown-item dropdown-btn demo-btn">
                      Bypass / Demo Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
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
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    LOG IN
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    CREATE ACCOUNT
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    MY DASHBOARD ({customer?.firstName || 'Client'}) 👤
                  </Link>
                </li>
                <li>
                  <button
                    className="mobile-nav-link mobile-logout-btn"
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    SIGN OUT
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
