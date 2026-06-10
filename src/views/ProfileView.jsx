import { Navigate } from 'react-router-dom';
import './ProfileView.css';

export default function ProfileView({
  customer,
  isLoggedIn,
  onLogout,
  authLoading
}) {
  const handleEditAddresses = () => {
    alert('Address modifications are synced with secure Shopify customer portals.');
  };

  const getInitials = () => {
    if (!customer) return 'U';
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
    }
    return customer.email?.[0]?.toUpperCase() || 'U';
  };

  if (authLoading) {
    return (
      <div className="profile-container-loading">
        <div className="profile-loading-spinner">⏳</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic' }}>
          Contacting Shopify secure servers...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

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
            <div className="profile-avatar">{getInitials()}</div>
            <h3 className="profile-name">
              {customer.firstName || ''} {customer.lastName || ''}
            </h3>
            <p className="profile-email">{customer.email}</p>

            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Membership Tier</span>
              <span className="profile-meta-val tier">
                {customer.membershipTier || 'Preferred Client'}
              </span>
            </div>
            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Points Balance</span>
              <span className="profile-meta-val">
                {customer.pointsBalance || '0 pts'}
              </span>
            </div>
            <div className="profile-meta-row">
              <span className="profile-meta-lbl">Default Address</span>
              <span className="profile-meta-val">
                {customer.defaultAddress ? (
                  customer.defaultAddress.formatted ? (
                    customer.defaultAddress.formatted.join(', ')
                  ) : (
                    `${customer.defaultAddress.city || ''}, ${customer.defaultAddress.country || ''}`
                  )
                ) : (
                  'No default address set.'
                )}
              </span>
            </div>

            <div className="btn-profile-actions">
              <button onClick={handleEditAddresses}>Edit Addresses</button>
              <button onClick={onLogout}>Sign Out</button>
            </div>
          </div>

          {/* Right: Recent Orders Table logs */}
          <div className="orders-card">
            <h3 className="orders-title">Recent Orders</h3>
            <div className="orders-list">
              {!customer.orders || !customer.orders.edges || customer.orders.edges.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                  No recent orders found.
                </p>
              ) : (
                customer.orders.edges.map(({ node }, index) => (
                  <div key={index} className="order-item">
                    <div className="order-info">
                      <h5>Order #{node.orderNumber}</h5>
                      <span className="order-date">
                        Placed on{' '}
                        {new Date(node.processedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span
                      className={`order-status status-${(node.fulfillmentStatus || 'pending').toLowerCase()}`}
                    >
                      {(node.fulfillmentStatus || 'Pending').replace('_', ' ').toLowerCase()}
                    </span>
                    <span className="order-price">
                      {node.totalPrice ? (
                        `${node.totalPrice.currencyCode === 'INR' ? '₹' : node.totalPrice.currencyCode || '$'}${parseFloat(node.totalPrice.amount).toLocaleString()}`
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
