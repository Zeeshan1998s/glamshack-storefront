import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthDrawer.css';

const SHOPIFY_URL = 'https://tbxtcm-tf.myshopify.com/api/2023-07/graphql.json';
const PUBLIC_TOKEN = 'a3347112f66392d3099d47bc3d451bae';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.805 3.052 1.52-.075 2.136-.984 3.96-.984 1.838 0 2.4.984 3.996.948 1.646-.027 2.664-1.482 3.655-2.94 1.16-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.663 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.689.78-1.34 2.22-.16 3.606 1.35.104 2.648-.688 2.447-1.594z" fill="#000000" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
    </svg>
  );
}

export default function AuthDrawer({
  isOpen,
  onClose,
  isLoggedIn,
  onLoginSuccess,
  onDemoLogin,
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Reset state when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setMode('login');
    }
  }, [isOpen]);

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

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
      onClose();
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

      // Auto login
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
        throw new Error('Account created, but auto-login failed.');
      }

      const token = authData?.customerAccessToken?.accessToken;
      if (!token) {
        throw new Error('Account created, but session creation failed.');
      }

      localStorage.setItem('glamshack_customer_token', token);
      await onLoginSuccess(token);
      onClose();
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
        edges: []
      }
    };
    onDemoLogin(mockUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`custom-drawer right-drawer auth-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="auth-drawer-header">
          <button className="drawer-close-btn-auth" onClick={onClose}>✕</button>
          <h2 className="auth-drawer-title">{mode === 'login' ? 'Sign in' : 'Create Account'}</h2>
          <p className="auth-drawer-subtitle">
            This product is hand embroidered and may have slight dissimilarities that are a natural
          </p>
        </div>
        
        <div className="auth-drawer-content">
          {error && <div className="auth-error-banner">{error}</div>}

          {mode === 'login' ? (
            <form className="auth-drawer-form" onSubmit={handleShopifyLogin}>
              <div className="auth-input-group">
                <input
                  type="email"
                  className="auth-input-field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  className="auth-input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-drawer-submit" disabled={isLoading}>
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
              
              <div className="auth-divider-text">OR</div>
              
              <div className="auth-social-group">
                <button type="button" className="auth-social-btn" onClick={handleDemoSignIn} title="Demo Sign In (Google)">
                  <GoogleIcon />
                </button>
                <button type="button" className="auth-social-btn" onClick={handleDemoSignIn} title="Demo Sign In (Apple)">
                  <AppleIcon />
                </button>
              </div>

              <div className="auth-drawer-toggle">
                Don't have an account? <span onClick={toggleMode}>Create one</span>
              </div>
            </form>
          ) : (
            <form className="auth-drawer-form" onSubmit={handleShopifyRegister}>
              <div className="auth-input-row">
                <div className="auth-input-group">
                  <input
                    type="text"
                    className="auth-input-field"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="text"
                    className="auth-input-field"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <input
                  type="email"
                  className="auth-input-field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  className="auth-input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-drawer-submit" disabled={isLoading}>
                {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>

              <div className="auth-divider-text">OR</div>
              
              <div className="auth-social-group">
                <button type="button" className="auth-social-btn" onClick={handleDemoSignIn} title="Demo Sign In (Google)">
                  <GoogleIcon />
                </button>
                <button type="button" className="auth-social-btn" onClick={handleDemoSignIn} title="Demo Sign In (Apple)">
                  <AppleIcon />
                </button>
              </div>

              <div className="auth-drawer-toggle">
                Already have an account? <span onClick={toggleMode}>Sign in</span>
              </div>
            </form>
          )}
        </div>

        <div className="auth-drawer-footer">
          <div className="auth-footer-item">
            <TruckIcon />
            30-day returns* exclusions apply
          </div>
          <div className="auth-footer-item">
            <TruckIcon />
            30-day returns* exclusions apply
          </div>
          <div className="auth-footer-item">
            <TruckIcon />
            Free shipping on orders over 160000
          </div>
        </div>
      </div>
    </>
  );
}
