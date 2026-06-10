import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const DESKTOP_NAV_ITEMS = [
  { id: 'hampers', label: 'HAMPERS', to: '/shop?filter=hampers' },
  { id: 'trays', label: 'TRAYS', to: '/shop?filter=trays' },
  { id: 'saree-covers', label: 'SAREE COVERS', to: '/shop?category=saree-covers' },
  { id: 'bags', label: 'BAGS', to: '/shop?filter=bags' },
  { id: 'baskets', label: 'BASKETS', to: '/shop?filter=baskets' },
  { id: 'pouches', label: 'POUCHES', to: '/shop?filter=pouches' }
];

const MOBILE_NAV_ITEMS = [
  { id: 'hampers', label: 'HAMPERS', to: '/shop?category=hampers' },
  { id: 'trays', label: 'TRAYS', to: '/shop?category=trays' },
  { id: 'saree-covers', label: 'SAREE COVERS', to: '/shop?category=saree-covers' },
  { id: 'bags', label: 'BAGS', to: '/shop?category=bags' },
  { id: 'baskets', label: 'BASKET / TRUNKS', to: '/shop?category=baskets' },
  { id: 'pouches', label: 'POUCHES', to: '/shop?category=pouches' },
  { id: 'bands', label: 'BANDS', to: '/shop?category=bands' }
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 13" aria-hidden="true" className="header-icon-svg header-icon-fill search-icon-custom">
      <path d="M0 12.5865V10.9615H10.0328V12.5865H0ZM0 7.473V5.848H4.8865V7.473H0ZM0 2.4095V0.7845H4.8865V2.4095H0ZM18.4673 12.625L14.5038 8.61925C14.1089 8.88975 13.6831 9.10317 13.2262 9.2595C12.7694 9.416 12.3017 9.49425 11.823 9.49425C10.5207 9.49425 9.4105 9.03525 8.4925 8.11725C7.5745 7.19942 7.1155 6.07758 7.1155 4.75175C7.1155 3.42592 7.57525 2.3025 8.49475 1.3815C9.41442 0.4605 10.5266 0 11.8313 0C13.1361 0 14.2413 0.459 15.147 1.377C16.0528 2.29483 16.5058 3.41917 16.5058 4.75C16.5058 5.24483 16.4359 5.72083 16.2962 6.178C16.1564 6.635 15.9448 7.07117 15.6615 7.4865L19.6 11.4672L18.4673 12.625ZM11.823 7.86925C12.6723 7.86925 13.3943 7.56667 13.989 6.9615C14.5835 6.35617 14.8807 5.618 14.8807 4.747C14.8807 3.876 14.5835 3.13792 13.989 2.53275C13.3943 1.92758 12.6723 1.625 11.823 1.625C10.9737 1.625 10.2476 1.92883 9.64475 2.5365C9.04192 3.14417 8.7405 3.88517 8.7405 4.7595C8.7405 5.616 9.04017 6.34842 9.6395 6.95675C10.2388 7.56508 10.9667 7.86925 11.823 7.86925Z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon-svg">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.5C5.9 16.8 8.4 15 12 15C15.6 15 18.1 16.8 19 19.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon-svg header-icon-fill">
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M2.2655 19.8C1.618 19.8 1.0785 19.5843 0.647 19.153C0.215667 18.7215 0 18.182 0 17.5345V6.9655C0 6.318 0.215667 5.7785 0.647 5.347C1.0785 4.91567 1.618 4.7 2.2655 4.7H4.1C4.1 3.38583 4.55642 2.274 5.46925 1.3645C6.38192 0.454834 7.49217 0 8.8 0C10.1078 0 11.2181 0.456417 12.1307 1.36925C13.0436 2.28192 13.5 3.39217 13.5 4.7H15.3345C15.982 4.7 16.5215 4.91567 16.953 5.347C17.3843 5.7785 17.6 6.318 17.6 6.9655V17.5345C17.6 18.182 17.3843 18.7215 16.953 19.153C16.5215 19.5843 15.982 19.8 15.3345 19.8H2.2655ZM2.2655 18.15H15.3345C15.4885 18.15 15.6296 18.0859 15.7578 17.9578C15.8859 17.8296 15.95 17.6885 15.95 17.5345V6.9655C15.95 6.8115 15.8859 6.67042 15.7578 6.54225C15.6296 6.41408 15.4885 6.35 15.3345 6.35H2.2655C2.1115 6.35 1.97042 6.41408 1.84225 6.54225C1.71408 6.67042 1.65 6.8115 1.65 6.9655V17.5345C1.65 17.6885 1.71408 17.8296 1.84225 17.9578C1.97042 18.0859 2.1115 18.15 2.2655 18.15ZM8.8 12.1C10.1078 12.1 11.2181 11.6436 12.1307 10.7308C13.0436 9.81808 13.5 8.70783 13.5 7.4H11.85C11.85 8.25 11.5532 8.97083 10.9595 9.5625C10.3658 10.1542 9.645 10.45 8.797 10.45C7.949 10.45 7.22917 10.1535 6.6375 9.5605C6.04583 8.96733 5.75 8.24717 5.75 7.4H4.1C4.1 8.71417 4.55642 9.826 5.46925 10.7355C6.38192 11.6452 7.49217 12.1 8.8 12.1ZM5.75 4.7H11.85C11.85 3.85 11.5532 3.12917 10.9595 2.5375C10.3658 1.94583 9.645 1.65 8.797 1.65C7.949 1.65 7.22917 1.9465 6.6375 2.5395C6.04583 3.13267 5.75 3.85283 5.75 4.7Z" fill="#999990" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon-svg">
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

export default function Header({
  cartCount,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
  onOpenAuth,
  isLoggedIn,
  customer,
  onLogout,
  onDemoLogin
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/' || location.pathname === '/home';

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
      <header className={isHome ? 'header-home' : 'header-alt'}>
        <div className="header-single-row desktop-only-header header-figma-row">
          <div className="header-left-group">
            <nav className="category-nav" aria-label="Primary">
              <ul className="category-nav-list compact">
                {DESKTOP_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <Link to={item.to} className="cat-nav-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button className="header-icon-btn search-btn" onClick={onOpenSearch} title="Search Catalog" aria-label="Search catalog">
              <SearchIcon />
            </button>
          </div>

          <Link to="/home" className="logo-stack" aria-label="Glamshack home">
            <span className="logo-wordmark">GLAMSHACK</span>
          </Link>

          <div className="header-right-group">
            <Link to="/about" className={`top-util-link ${isActive('/about') ? 'active' : ''}`}>
              ABOUT US
            </Link>
            <span className="currency-label">IN/INR</span>
            <div className="profile-menu-container">
              {isLoggedIn && customer ? (
                <button className="header-avatar-btn" onClick={() => navigate('/profile')} title="My Profile" aria-label="My profile">
                  {getInitials()}
                </button>
              ) : (
                <button className="header-icon-btn profile-btn" onClick={onOpenAuth} title="Log In / Register" aria-label="Open login">
                  <PersonIcon />
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
                    <a href="#" onClick={(e) => { e.preventDefault(); onOpenAuth(); }} className="dropdown-item">Log In</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onOpenAuth(); }} className="dropdown-item">Create Account</a>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleHeaderDemoSignIn} className="dropdown-item dropdown-btn demo-btn">
                      Bypass / Demo Sign In
                    </button>
                  </>
                )}
              </div>
            </div>

            <button className="header-icon-btn wishlist-btn" onClick={onOpenWishlist} title="Wishlist" aria-label="Open wishlist">
              <HeartIcon />
            </button>
            <button className="btn-open-cart" onClick={onOpenCart} aria-label="Open cart">
              <BagIcon />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <div className="header-single-row mobile-only-header">
          <button className="header-icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} title="Open Menu" aria-label="Open menu">
            <MenuIcon />
          </button>

          <div className="mobile-logo-wrapper">
            <Link to="/home" className="logo-stack mobile-logo-stack" aria-label="Glamshack home">
              <span className="logo-wordmark">GLAMSHACK</span>
              {/* <span className="logo-origin">DENMARK</span> */}
            </Link>
          </div>

          <div className="header-right-group mobile-right-icons">
            <button className="header-icon-btn search-btn" onClick={onOpenSearch} title="Search Catalog" aria-label="Search catalog">
              <SearchIcon />
            </button>
            <button className="header-icon-btn wishlist-btn" onClick={onOpenWishlist} title="Wishlist" aria-label="Open wishlist">
              <HeartIcon />
            </button>
            <button className="btn-open-cart" onClick={onOpenCart} aria-label="Open cart">
              <BagIcon />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <Link to="/home" className="logo-stack mobile-drawer-logo" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="logo-wordmark">GLAMSHACK</span>
              {/* <span className="logo-origin">DENMARK</span> */}
            </Link>
            <button className="mobile-nav-close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">X</button>
          </div>

          <div className="mobile-nav-divider"></div>
          <ul className="mobile-nav-links">
            {MOBILE_NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link to={item.to} className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
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
                  <a href="#" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onOpenAuth(); setIsMobileMenuOpen(false); }}>
                    LOG IN
                  </a>
                </li>
                <li>
                  <a href="#" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onOpenAuth(); setIsMobileMenuOpen(false); }}>
                    CREATE ACCOUNT
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    MY DASHBOARD ({customer?.firstName || 'Client'})
                  </Link>
                </li>
                <li>
                  <button
                    className="mobile-nav-link mobile-logout-btn"
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
