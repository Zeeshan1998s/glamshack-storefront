import  { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './ProfileView.css';

const SHOPIFY_URL = 'https://tbxtcm-tf.myshopify.com/api/2023-07/graphql.json';
const PUBLIC_TOKEN = 'a3347112f66392d3099d47bc3d451bae';

export default function ProfileView({
  mode = 'profile',
  customer,
  isLoggedIn,
  onLogout,
  onLoginSuccess,
  onDemoLogin,
  authLoading
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleShopifyLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(SHOPIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
        },
        body: JSON.stringify({
          query: `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) {
                customerAccessToken {
                  accessToken
                  expiresAt
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: { email, password }
          }
        })
      });

      const res = await response.json();
      const authData = res.data?.customerAccessTokenCreate;
      
      if (authData?.customerUserErrors && authData.customerUserErrors.length > 0) {
        throw new Error(authData.customerUserErrors[0].message);
      }

      const token = authData?.customerAccessToken?.accessToken;
      if (!token) {
        throw new Error('Authentication failed. Check your credentials.');
      }

      localStorage.setItem('glamshack_customer_token', token);
      await onLoginSuccess(token);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopifyRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Call customerCreate mutation
      const response = await fetch(SHOPIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
        },
        body: JSON.stringify({
          query: `
            mutation customerCreate($input: CustomerCreateInput!) {
              customerCreate(input: $input) {
                customer {
                  id
                  email
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              firstName,
              lastName,
              email,
              password
            }
          }
        })
      });

      const res = await response.json();
      const registerData = res.data?.customerCreate;

      if (registerData?.customerUserErrors && registerData.customerUserErrors.length > 0) {
        throw new Error(registerData.customerUserErrors[0].message);
      }

      // 2. Automatically log them in after registration
      const loginResponse = await fetch(SHOPIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
        },
        body: JSON.stringify({
          query: `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) {
                customerAccessToken {
                  accessToken
                  expiresAt
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: { email, password }
          }
        })
      });

      const loginRes = await loginResponse.json();
      const authData = loginRes.data?.customerAccessTokenCreate;

      if (authData?.customerUserErrors && authData.customerUserErrors.length > 0) {
        throw new Error('Account created successfully, but auto-login failed. Please sign in manually.');
      }

      const token = authData?.customerAccessToken?.accessToken;
      if (!token) {
        throw new Error('Account created successfully, but session creation failed. Please sign in manually.');
      }

      localStorage.setItem('glamshack_customer_token', token);
      await onLoginSuccess(token);
    } catch (err) {
      setError(err.message || 'Something went wrong during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
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
          },
          {
            node: {
              orderNumber: 2712,
              processedAt: new Date(2026, 8, 12).toISOString(),
              totalPrice: { amount: '45.00', currencyCode: 'USD' },
              fulfillmentStatus: 'FULFILLED'
            }
          },
          {
            node: {
              orderNumber: 2640,
              processedAt: new Date(2026, 7, 5).toISOString(),
              totalPrice: { amount: '95.00', currencyCode: 'USD' },
              fulfillmentStatus: 'FULFILLED'
            }
          }
        ]
      }
    };
    onDemoLogin(mockUser);
  };

  const handleSignOut = () => {
    onLogout();
  };

  const toggleMode = () => {
    if (mode === 'login') {
      navigate('/register');
    } else {
      navigate('/login');
    }
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

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

  if (authLoading || isLoading) {
    return (
      <div className="profile-container-loading">
        <div className="profile-loading-spinner">⏳</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic' }}>
          Contacting Shopify secure servers...
        </p>
      </div>
    );
  }

  if (isLoggedIn && (mode === 'login' || mode === 'register')) {
    return <Navigate to="/profile" replace />;
  }

  if (!isLoggedIn && mode === 'profile') {
    return <Navigate to="/login" replace />;
  }

  if (!isLoggedIn) {
    return (
      <div id="view-profile" className="page-view active-view">
        <div className="auth-wrapper">
          <div className="auth-card">
            {mode === 'register' ? (
              /* Registration View */
              <>
                <div className="auth-header">
                  <span className="auth-subtitle-tag">Secure Portal</span>
                  <h2 className="auth-main-title">Create Account</h2>
                </div>

                {error && <div className="auth-error-banner">{error}</div>}

                <form className="auth-form" onSubmit={handleShopifyRegister}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="auth-field">
                      <label className="auth-label">First Name</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Last Name</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Email Address</label>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <input
                      type="password"
                      className="auth-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-auth-submit">
                    Register Account
                  </button>
                </form>

                <div className="auth-toggle-link" onClick={toggleMode}>
                  Already have an account? <span>Sign In</span>
                </div>
              </>
            ) : (
              /* Login View */
              <>
                <div className="auth-header">
                  <span className="auth-subtitle-tag">Secure Portal</span>
                  <h2 className="auth-main-title">Client Log In</h2>
                </div>

                {error && <div className="auth-error-banner">{error}</div>}

                <form className="auth-form" onSubmit={handleShopifyLogin}>
                  <div className="auth-field">
                    <label className="auth-label">Email Address</label>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <input
                      type="password"
                      className="auth-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-auth-submit">
                    Sign In
                  </button>
                </form>

                <div className="auth-toggle-link" onClick={toggleMode}>
                  Don't have an account? <span>Register here</span>
                </div>

                <div className="auth-divider-container">
                  <div className="auth-divider-line"></div>
                  <div className="auth-divider-text">Or</div>
                  <div className="auth-divider-line"></div>
                </div>

                <button className="btn-auth-demo" onClick={handleDemoSignIn}>
                  Bypass / Demo Sign In
                </button>

                <p className="auth-tip">
                  <strong>Tip:</strong> Sign in with your registered Shopify credentials, or use the <strong>Demo Sign In</strong> to preview the VIP client dashboard offline.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
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
              <button onClick={handleSignOut}>Sign Out</button>
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
