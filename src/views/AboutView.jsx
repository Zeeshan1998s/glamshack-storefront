import React from 'react';

export default function AboutView() {
  return (
    <div id="view-about" className="page-view active-view" style={{ paddingTop: 0 }}>
      
      {/* Full Width Hero Section */}
      <div style={{ position: 'relative', width: '100%', height: '40vh', minHeight: '300px', marginBottom: '0', backgroundColor: '#333b24', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <span className="article-meta" style={{ color: '#e5c158', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 500 }}>The Glamshack Philosophy</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', margin: 0, fontWeight: 300, lineHeight: 1.15 }}>Conscious Gifting & Aesthetics</h1>
      </div>

      <div className="pdp-wrapper" style={{ width: '100%', paddingBottom: '80px', paddingTop: '80px' }}>
        <div className="container">
          <div className="article-body-content" style={{ maxWidth: '800px', margin: '0 auto 60px' }}>
            <p><span className="dropcap">F</span>ounded on the uncompromising principle that true luxury resides in the details, Glamshack curates premium bespoke gifting products and cosmetics packaging meant to elevate every significant occasion. Our journey began with a simple observation: the modern celebration requires a presentation that is as thoughtful and enduring as the gift itself. We meticulously blend classical elements of heritage design with modern, functional minimalism, utilizing rich velvets, precision metallic closures, and intricate gold-embossed details to create pieces that are, in themselves, works of art.</p>
            <p>The Glamshack aesthetic is defined by a deep appreciation for the artisanal process. Whether you are celebrating a modern wedding, organizing high-pigment custom cosmetics, or selecting the perfect bespoke ring platter, we believe the unboxing experience should be a sensory delight. Our design studio is committed to ethical sourcing, uncompromising premium quality, and zero-waste packaging aesthetics that respect both our clients and our environment. Every item that leaves our boutique has been inspected to ensure it meets our rigorous standards for luxury and durability.</p>
            <p>We work intimately with a network of master craftsmen and heritage artists who bring generations of skill to their work. From the intricate Zardosi embroidery found on our signature trays to the hand-folded silk linings of our trousseau boxes, these details cannot be replicated by mass production. By choosing Glamshack, you are not only investing in a beautiful product; you are supporting a community of artisans and preserving traditional crafting techniques for the modern era.</p>
          </div>

          <div className="about-grid" style={{ gridTemplateColumns: '1fr', textAlign: 'center', marginBottom: '80px' }}>
            <div className="about-text-box" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 className="about-subtitle" style={{ fontSize: '32px', marginBottom: '24px' }}>Our Commitment to Excellence</h3>
              <p className="about-desc" style={{ fontSize: '16.8px' }}>
                We understand that the items we create often play a central role in the most important days of your life. That is why we source only the finest raw materials—from sustainable, heavy-weight chipboard that ensures structural integrity, to lush, imported fabrics that offer an unmatched tactile experience. Our design team continuously explores new palettes, textures, and forms to ensure our collections remain at the forefront of the luxury gifting industry.
              </p>

              <div className="about-stats" style={{ justifyContent: 'center', marginTop: '48px', gap: '60px' }}>
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
          </div>

          {/* Pillars Section */}
          <div className="about-pillars">
            <div className="pillar-card">
              <div className="pillar-icon">🌿</div>
              <h4 className="pillar-title">Sustainable Ethos</h4>
              <p className="pillar-text">
                We select recycled box boards and acid-free tissue to ensure our packaging is as gentle on the earth as it is premium in the hand. We actively minimize single-use plastics across our entire supply chain.
              </p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">🎨</div>
              <h4 className="pillar-title">Handcrafted Details</h4>
              <p className="pillar-text">
                From delicate silk safas to heavily embroidered Zardosi platters, every single item is finished by hand by our dedicated community of master craftsmen, ensuring unparalleled uniqueness.
              </p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">✨</div>
              <h4 className="pillar-title">Sensory Unboxing</h4>
              <p className="pillar-text">
                Each Glamshack box is subtly scented with our custom rose-cream signature botanical blend, designed specifically to delight the senses and evoke a feeling of luxury upon opening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
