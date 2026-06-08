import React from 'react';

export default function AboutView() {
  return (
    <div id="view-about" className="page-view active-view">
      <div className="container profile-wrapper">
        <div className="section-header">
          <span className="section-title-tag">The Glamshack Philosophy</span>
          <h2 className="section-main-title">Conscious Gifting & Aesthetics</h2>
        </div>

        <div className="about-grid">
          <div className="about-text-box">
            <h3 className="about-subtitle">Artisanal Roots, Modern Elegance</h3>
            <p className="about-desc">
              Founded on the principle that luxury is in the details, Glamshack curates premium gifting products and
              cosmetics packaging meant to make every occasion memorable. We blend classical elements of heritage design
              with modern functionality, utilizing rich velvets, metallic closures, and gold-embossed details.
            </p>
            <p className="about-desc">
              Whether celebrating a modern wedding, organizing high-pigment custom cosmetics, or selecting the perfect
              bespoke ring platter, Glamshack is committed to ethical sourcing, premium design quality, and zero-waste
              packaging aesthetics.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Vegan & Ethical</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">25k+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">15+</span>
                <span className="stat-label">Heritage Artists</span>
              </div>
            </div>
          </div>

          <div className="about-img-box">
            <img
              className="about-img"
              src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&amp;auto=format&amp;fit=crop"
              alt="Glamshack Luxury Gifting Design Process"
            />
          </div>
        </div>

        {/* Pillars Section */}
        <div className="about-pillars">
          <div className="pillar-card">
            <div className="pillar-icon">🌿</div>
            <h4 className="pillar-title">Sustainable Ethos</h4>
            <p className="pillar-text">
              We select recycled box boards and acid-free tissue to ensure our packaging is as gentle on the earth as it is
              premium in the hand.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🎨</div>
            <h4 className="pillar-title">Handcrafted Details</h4>
            <p className="pillar-text">
              From silk safas to Zardosi platters, every item is finished by hand by our community of master craftsmen.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">✨</div>
            <h4 className="pillar-title">Sensory Unboxing</h4>
            <p className="pillar-text">
              Each Glamshack box is scented with our custom rose-cream signature blend to delight the senses upon opening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
