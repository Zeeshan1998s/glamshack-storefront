import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './ProfileView.css';

// Shopify API variables
const SHOPIFY_URL = 'https://tbxtcm-tf.myshopify.com/api/2023-07/graphql.json';
const PUBLIC_TOKEN = 'a3347112f66392d3099d47bc3d451bae';

async function shopifyMutation(query, variables) {
  const response = await fetch(SHOPIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}

// Helper to check if it's the demo account
const isDemoUser = () => {
  return !!localStorage.getItem('glamshack_demo_user');
};

// ----------------------------------------------------------------------
// 1. Personal Details Tab
// ----------------------------------------------------------------------
function PersonalDetailsTab({ customer, refreshCustomer }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    email: customer.email || '',
    phone: customer.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');

    if (isDemoUser()) {
      // Mock success for Demo account
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg('Details updated successfully! (Demo Mode)');
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg('');
        }, 2000);
      }, 800);
      return;
    }

    const token = localStorage.getItem('glamshack_customer_token');
    if (!token) return;

    // Sanitize input: empty strings can cause GraphQL validation errors
    const sanitizedCustomer = {};
    if (formData.firstName) sanitizedCustomer.firstName = formData.firstName;
    if (formData.lastName) sanitizedCustomer.lastName = formData.lastName;
    if (formData.email) sanitizedCustomer.email = formData.email;
    if (formData.phone) sanitizedCustomer.phone = formData.phone;

    const query = `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer { id }
          customerUserErrors { message field }
        }
      }
    `;

    try {
      const res = await shopifyMutation(query, {
        customerAccessToken: token,
        customer: sanitizedCustomer
      });
      
      const errors = res.data?.customerUpdate?.customerUserErrors;
      if (errors && errors.length > 0) {
        alert(errors.map(e => e.message).join('\n'));
      } else {
        await refreshCustomer();
        setSuccessMsg('Details updated successfully!');
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      alert('An error occurred while updating your details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="tab-container">
        <div className="tab-header-row">
          <h3 className="tab-title">Personal Details</h3>
        </div>
        <div className="personal-details-card">
          <div className="pd-info-block">
            <h4 className="pd-name">{customer.firstName} {customer.lastName}</h4>
            <div className="pd-contact">
              <div className="pd-field">
                <span className="pd-label">Email</span>
                <span className="pd-value">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="pd-field">
                  <span className="pd-label">Phone</span>
                  <span className="pd-value">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
          <button className="btn-outline" onClick={() => setIsEditing(true)}>EDIT DETAILS</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      <button className="btn-back" onClick={() => setIsEditing(false)}>← Back</button>
      <h3 className="tab-title">Personal Details</h3>
      
      {successMsg && <div className="success-banner">{successMsg}</div>}
      
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>FIRST NAME</label>
            <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>LAST NAME</label>
            <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>EMAIL</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>PHONE NUMBER (Optional)</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1234567890" />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'UPDATING...' : 'UPDATE'}
          </button>
          <button type="button" className="btn-outline btn-cancel" onClick={() => setIsEditing(false)} disabled={isLoading}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. Orders Tab
// ----------------------------------------------------------------------
function OrdersTab({ customer }) {
  const edges = customer?.orders?.edges || [];
  
  return (
    <div className="tab-container">
      <h3 className="tab-title">Order History</h3>
      {edges.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet</p>
          <button className="btn-primary" onClick={() => window.location.href='/shop'}>START SHOPPING</button>
        </div>
      ) : (
        <div className="orders-list">
          {edges.map(({ node }, i) => (
             <div key={i} className="order-item-card">
               <div className="order-header">
                 <h5>Order #{node.orderNumber}</h5>
                 <span className="order-date">{new Date(node.processedAt).toLocaleDateString()}</span>
               </div>
               <div className="order-body">
                 <span className={`order-status status-${(node.fulfillmentStatus || 'pending').toLowerCase()}`}>
                   {node.fulfillmentStatus || 'Pending'}
                 </span>
                 <span className="order-price">
                   {node.totalPrice.currencyCode === 'INR' ? '₹' : node.totalPrice.currencyCode || '$'}
                   {parseFloat(node.totalPrice.amount).toLocaleString()}
                 </span>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Wishlist Tab
// ----------------------------------------------------------------------
function WishlistTab({ wishlist = [], onRemove, onClear, onMoveAll }) {
  return (
    <div className="tab-container">
      <h3 className="tab-title">Wishlist</h3>
      {wishlist.length > 0 && (
        <button className="btn-primary" style={{marginBottom: '20px', width: '100%'}} onClick={onMoveAll}>MOVE ALL ITEMS TO BAG</button>
      )}
      
      <div className="wishlist-meta-bar">
        <div className="wishlist-actions">
          <button className="btn-text" onClick={() => alert('Wishlist link copied to clipboard!')}>Share Wishlist</button>
          <button className="btn-text" onClick={onClear}>Clear Wishlist</button>
        </div>
        <span className="item-count">{wishlist.length} Item{wishlist.length !== 1 && 's'}</span>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is currently empty.</p>
          <button className="btn-primary" onClick={() => window.location.href='/shop'}>DISCOVER PRODUCTS</button>
        </div>
      ) : (
        <div className="wishlist-grid-view">
          {wishlist.map(item => (
            <div key={item.id || item.title} className="wishlist-product-card">
              <div className="wishlist-img-wrapper">
                <img src={item.imageSrc || item.image || 'https://via.placeholder.com/300x400'} alt={item.title} />
                <button className="btn-remove-wishlist" onClick={() => onRemove(item.id || item.title)}>✕</button>
              </div>
              <div className="wishlist-info">
                <h4>{item.title}</h4>
                <div className="price-row">
                  <span className="price">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Address Book Tab
// ----------------------------------------------------------------------
function AddressBookTab({ customer, refreshCustomer }) {
  const [activeView, setActiveView] = useState('list'); // 'list', 'add', 'edit'
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const addresses = customer?.addresses?.edges?.map(e => e.node) || [];
  const defaultAddressId = customer?.defaultAddress?.id;

  const handleDemoMock = (msg) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(msg + ' (Mocked in Demo Mode)');
      setActiveView('list');
    }, 800);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (isDemoUser()) return handleDemoMock('Address saved successfully!');
    
    setIsLoading(true);
    const token = localStorage.getItem('glamshack_customer_token');
    
    // Extract form data
    const formData = new FormData(e.target);
    const addressInput = {
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      city: formData.get('city'),
      province: formData.get('province'),
      country: formData.get('country'),
      zip: formData.get('zip'),
      phone: formData.get('phone'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    };
    
    // Clean empty values
    Object.keys(addressInput).forEach(key => !addressInput[key] && delete addressInput[key]);

    const isUpdate = activeView === 'edit' && editingAddress;
    const query = isUpdate ? `
      mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerUserErrors { message }
        }
      }
    ` : `
      mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerUserErrors { message }
        }
      }
    `;
    
    const variables = {
      customerAccessToken: token,
      address: addressInput
    };
    if (isUpdate) variables.id = editingAddress.id;

    try {
      const res = await shopifyMutation(query, variables);
      const errors = isUpdate ? res.data?.customerAddressUpdate?.customerUserErrors : res.data?.customerAddressCreate?.customerUserErrors;
      
      if (errors && errors.length > 0) {
        alert(errors.map(err => err.message).join('\n'));
      } else {
        await refreshCustomer();
        setActiveView('list');
      }
    } catch (err) {
      alert('An error occurred while saving the address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    if (isDemoUser()) return handleDemoMock('Address deleted!');

    setIsLoading(true);
    const token = localStorage.getItem('glamshack_customer_token');
    const query = `
      mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          customerUserErrors { message }
        }
      }
    `;
    
    try {
      const res = await shopifyMutation(query, { customerAccessToken: token, id });
      const errors = res.data?.customerAddressDelete?.customerUserErrors;
      if (errors && errors.length > 0) {
        alert(errors.map(err => err.message).join('\n'));
      } else {
        await refreshCustomer();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    if (isDemoUser()) return handleDemoMock('Default address updated!');
    
    setIsLoading(true);
    const token = localStorage.getItem('glamshack_customer_token');
    const query = `
      mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customerUserErrors { message }
        }
      }
    `;
    
    try {
      const res = await shopifyMutation(query, { customerAccessToken: token, addressId: id });
      const errors = res.data?.customerDefaultAddressUpdate?.customerUserErrors;
      if (errors && errors.length > 0) {
        alert(errors.map(err => err.message).join('\n'));
      } else {
        await refreshCustomer();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (activeView === 'add' || activeView === 'edit') {
    const isEdit = activeView === 'edit';
    const initData = isEdit ? editingAddress : {};
    
    return (
      <div className="tab-container">
        <button className="btn-back" onClick={() => setActiveView('list')}>← Back</button>
        <h3 className="tab-title">{isEdit ? 'Edit Address' : 'Add a New Address'}</h3>
        
        <form className="edit-form" onSubmit={handleSaveAddress}>
          <div className="form-row">
            <div className="form-group">
              <label>FIRST NAME</label>
              <input type="text" name="firstName" defaultValue={initData.firstName || customer.firstName || ''} required />
            </div>
            <div className="form-group">
              <label>LAST NAME</label>
              <input type="text" name="lastName" defaultValue={initData.lastName || customer.lastName || ''} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ADDRESS LINE 1</label>
              <input type="text" name="address1" defaultValue={initData.address1 || ''} required />
            </div>
            <div className="form-group">
              <label>ADDRESS LINE 2</label>
              <input type="text" name="address2" defaultValue={initData.address2 || ''} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>CITY</label>
              <input type="text" name="city" defaultValue={initData.city || ''} required />
            </div>
            <div className="form-group">
              <label>PROVINCE/STATE</label>
              <input type="text" name="province" defaultValue={initData.province || ''} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP / POSTAL CODE</label>
              <input type="text" name="zip" defaultValue={initData.zip || ''} required />
            </div>
            <div className="form-group">
              <label>COUNTRY</label>
              <input type="text" name="country" defaultValue={initData.country || ''} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: '0.5' }}>
              <label>PHONE (Optional)</label>
              <input type="text" name="phone" defaultValue={initData.phone || ''} />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'SAVING...' : 'SAVE ADDRESS'}
            </button>
            <button type="button" className="btn-outline btn-cancel" onClick={() => setActiveView('list')} disabled={isLoading}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List View
  return (
    <div className="tab-container">
      <h3 className="tab-title">Address Book</h3>
      <button className="btn-outline full-width" style={{marginBottom: '30px'}} onClick={() => { setEditingAddress(null); setActiveView('add'); }}>
        ADD A NEW ADDRESS
      </button>
      
      {addresses.length === 0 ? (
        <p className="empty-text">You have no addresses saved.</p>
      ) : (
        <div className="address-list">
          {addresses.map(addr => {
            const isDefault = addr.id === defaultAddressId;
            return (
              <div key={addr.id} className="address-card" style={{ marginBottom: '20px' }}>
                <div className="address-card-header">
                  <strong>{addr.firstName || customer.firstName} {addr.lastName || customer.lastName}</strong>
                  <div className="address-card-actions">
                    <button className="btn-text" onClick={() => { setEditingAddress(addr); setActiveView('edit'); }} disabled={isLoading}>Edit</button>
                    <button className="btn-text" onClick={() => handleDeleteAddress(addr.id)} disabled={isLoading}>Delete</button>
                  </div>
                </div>
                <div className="address-body">
                  <p className="address-formatted">
                    {addr.formatted 
                      ? addr.formatted.map((line, idx) => <span key={idx}>{line}<br/></span>) 
                      : `${addr.address1}, ${addr.city}, ${addr.country}`}
                  </p>
                </div>
                {isDefault ? (
                  <button className="btn-default-badge">My default delivery address</button>
                ) : (
                  <button className="btn-text" style={{ fontSize: '0.75rem', marginTop: '10px' }} onClick={() => handleSetDefault(addr.id)} disabled={isLoading}>
                    Set as default
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main ProfileView Component
// ----------------------------------------------------------------------
export default function ProfileView({
  customer,
  isLoggedIn,
  onLogout,
  authLoading,
  wishlist,
  onRemoveWishlistItem,
  onClearWishlist,
  onMoveAllToBag,
  refreshCustomer
}) {
  const [activeTab, setActiveTab] = useState('personal');

  if (authLoading) {
    return (
      <div className="profile-container-loading">
        <div className="profile-loading-spinner">⏳</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic' }}>
          Contacting secure servers...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div id="view-profile" className="page-view active-view" style={{ background: '#EFECE7' }}>
      <div className="profile-dashboard-layout">
        
        {/* Sidebar */}
        <div className="profile-sidebar">
          <h2 className="sidebar-greeting">Hello, {customer.firstName || 'User'}</h2>
          <nav className="sidebar-nav">
            <button 
              className={`nav-btn ${activeTab === 'personal' ? 'active' : ''}`} 
              onClick={() => setActiveTab('personal')}
            >Personal Details</button>
            
            <button 
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} 
              onClick={() => setActiveTab('orders')}
            >My Orders</button>
            
            <button 
              className={`nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`} 
              onClick={() => setActiveTab('wishlist')}
            >Wishlist</button>
            
            <button 
              className={`nav-btn ${activeTab === 'address' ? 'active' : ''}`} 
              onClick={() => setActiveTab('address')}
            >Address book</button>
          </nav>
          
          <button className="nav-btn-logout" onClick={onLogout}>LOGout</button>
        </div>

        {/* Main Content Area */}
        <div className="profile-main-content">
          {activeTab === 'personal' && <PersonalDetailsTab customer={customer} refreshCustomer={refreshCustomer} />}
          {activeTab === 'orders' && <OrdersTab customer={customer} />}
          {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} onRemove={onRemoveWishlistItem} onClear={onClearWishlist} onMoveAll={onMoveAllToBag} />}
          {activeTab === 'address' && <AddressBookTab customer={customer} refreshCustomer={refreshCustomer} />}
        </div>
      </div>
    </div>
  );
}
