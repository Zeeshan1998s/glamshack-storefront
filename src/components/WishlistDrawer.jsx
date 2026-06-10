import { useNavigate } from 'react-router-dom';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  onRemoveItem,
  onClearWishlist,
  onMoveAllToBag,
  onOpenCart
}) {
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    e.preventDefault();
    onClose();
    navigate('/profile');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay open" onClick={onClose}></div>
      <div className="custom-drawer right-drawer open">
        <div className="drawer-header-icons">
          <span>OUR WORLD IN/₹</span>
          <button
            className="icon-btn"
            onClick={handleProfileClick}
          >
            👤
          </button>
          <button className="icon-btn" onClick={onClose}>
            ♡
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
          >
            👜
          </button>
          <button className="drawer-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="drawer-content">
          <h2 className="drawer-title">Wishlist</h2>
          <p className="drawer-subtitle">
            Your wishlist will be saved for a limited time.{' '}
            <a href="#" onClick={handleProfileClick}>
              Sign in
            </a>{' '}
            or{' '}
            <a href="#" onClick={handleProfileClick}>
              Create an account
            </a>{' '}
            to save it and view your items on different devices
          </p>
          <div className="wishlist-divider"></div>
          <div className="drawer-items">
            {wishlist.length === 0 ? (
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Your wishlist is currently empty.
              </p>
            ) : (
              wishlist.map((item, index) => (
                <div key={index} className="wishlist-item">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300'}
                    alt={item.title}
                    className="wishlist-item-img"
                  />
                  <div className="wishlist-item-info">
                    <div className="wishlist-item-top">
                      <div>
                        <div className="wishlist-item-title">{item.title}</div>
                        <div className="wishlist-item-variant">{item.variant || 'Standard'}</div>
                      </div>
                      <button
                        className="wishlist-item-remove"
                        onClick={() => onRemoveItem(item.id || item.title)}
                      >
                        🗑
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div className="wishlist-item-price">{item.price}</div>
                      <div className="wishlist-qty-selector">
                        <button className="wishlist-qty-btn">-</button>
                        <span className="wishlist-qty-val">1</span>
                        <button className="wishlist-qty-btn">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="drawer-footer-wishlist">
          <button className="btn-move-all" onClick={onMoveAllToBag}>
            MOVE ALL ITEMS TO BAG
          </button>
          <button className="btn-clear-all" onClick={onClearWishlist}>
            CLEAR WISHLIST
          </button>
        </div>
      </div>
    </>
  );
}
