
export default function ProfileView() {
  const handleEditAddresses = () => {
    alert('Address modifications are synced with secure Shopify customer portals.');
  };

  const handleSignOut = () => {
    alert('Signing out will clear local access tokens.');
  };

  return (
    <div id="view-profile" className="page-view active-view">
      <div className="container profile-wrapper">
        <div className="section-header">
          <span className="section-title-tag">Account Dashboard</span>
          <h2 className="section-main-title">Welcome Back</h2>
        </div>

        <div className="profile-grid">
          {/* Left: Customer Profile Meta Card */}
          <div className="profile-card">
            <div className="profile-avatar">ZH</div>
            <h3 className="profile-name">Zeeshan Hanif</h3>
            <p className="profile-email">zeeshanze19@gmail.com</p>

            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Membership Tier</span>
              <span className="profile-meta-val tier">VIP Platinum</span>
            </div>
            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Points Balance</span>
              <span className="profile-meta-val">1,240 pts</span>
            </div>
            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Default Address</span>
              <span className="profile-meta-val">Lucknow, India</span>
            </div>

            <div className="btn-profile-actions">
              <button onClick={handleEditAddresses}>Edit Addresses</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>

          {/* Right: Recent Orders Table logs */}
          <div className="orders-card">
            <h3 className="orders-title">Recent Orders</h3>
            <div className="orders-list">
              <div className="order-item">
                <div className="order-info">
                  <h5>Order #2847</h5>
                  <span className="order-date">Placed on October 24, 2026</span>
                </div>
                <span className="order-status status-shipped">In Transit</span>
                <span className="order-price">$185.00</span>
              </div>

              <div className="order-item">
                <div className="order-info">
                  <h5>Order #2712</h5>
                  <span className="order-date">Placed on September 12, 2026</span>
                </div>
                <span className="order-status status-completed">Delivered</span>
                <span className="order-price">$45.00</span>
              </div>

              <div className="order-item">
                <div className="order-info">
                  <h5>Order #2640</h5>
                  <span className="order-date">Placed on August 05, 2026</span>
                </div>
                <span className="order-status status-completed">Delivered</span>
                <span className="order-price">$95.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
