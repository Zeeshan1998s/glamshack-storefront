import CoverImage from "../assets/footer.jpg"

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed!');
    e.target.reset();
  };

  return (
    <footer className="site-footer" style={{ backgroundImage: `url(${CoverImage})` }}>
      <div className="footer-content-box">
        <div className="footer-grid">
          <div className="footer-col-group">
            {/* Col 1 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Our Families</h4>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">One to one appointment</a></li>
                <li><a href="#">Order Tracking</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Product Care</a></li>
                <li><a href="#">Authenticity</a></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Our Families</h4>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">One to one appointment</a></li>
                <li><a href="#">Order Tracking</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Product Care</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Our Families</h4>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">One to one appointment</a></li>
                <li><a href="#">Order Tracking</a></li>
              </ul>
            </div>
          </div>

          {/* Col 4 */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="newsletter-desc">
              Subscribe to our newsletter & enjoy an exclusive 10% off your first full-price order.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="ENTER YOUR EMAIL HERE*" required className="newsletter-input" />
              <button type="submit" className="newsletter-submit-btn">SUBSCRIBE</button>
            </form>
            <div className="footer-socials">
              <a href="#" title="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="#" title="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" title="Pinterest">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z">
                  </path>
                </svg>
              </a>
              <a href="#" title="X">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                  </path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright-row">
          <div className="footer-copyright left">
            Copyright &copy; {new Date().getFullYear()} GLAMSHACK - All Rights Reserved
          </div>
          <div className="footer-copyright right">
            Copyright &copy; {new Date().getFullYear()} GLAMSHACK - All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
