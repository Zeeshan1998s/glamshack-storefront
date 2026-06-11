import React from 'react';

export default function PrivacyView() {
  return (
    <div id="view-privacy" className="page-view active-view" style={{ paddingTop: 0 }}>
      
      {/* Full Width Hero Section */}
      <div style={{ position: 'relative', width: '100%', height: '40vh', minHeight: '300px', marginBottom: '0', backgroundColor: '#333b24', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <span className="article-meta" style={{ color: '#e5c158', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 500 }}>Glamshack Legal & Privacy</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', margin: 0, fontWeight: 300, lineHeight: 1.15 }}>Privacy Policy</h1>
      </div>

      <div className="pdp-wrapper" style={{ width: '100%', paddingBottom: '80px', paddingTop: '80px' }}>
        <div className="container">
          <div className="article-body-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p><span className="dropcap">A</span>t Glamshack, your privacy and the security of your personal data are of the utmost importance to us. As a purveyor of luxury bespoke gifting and cosmetic packaging, we believe that the trust you place in our brand should be met with the highest standards of data protection. This comprehensive Privacy Policy outlines exactly how we collect, process, use, and safeguard your personal information when you navigate our digital storefront, interact with our content, or purchase our artisanal products.</p>
            
            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>1. The Information We Collect</h3>
            <p>When you visit the Glamshack digital boutique, we automatically collect specific information about your device and browsing patterns. This includes data regarding your web browser, IP address, time zone, and the cookies currently installed on your device. As you browse our collections—whether exploring our Zardosi platters or our premium saree covers—we gather analytics on the individual web pages or products you view, what websites or search terms referred you to our site, and your overall interaction metrics. We refer to this automatically-collected data as "Device Information."</p>
            <p>Additionally, when you make a purchase or attempt to make a purchase through the site, we collect essential information required to fulfill your luxury order. This includes your name, billing address, shipping address, payment information (such as credit card numbers and secure gateway tokens), email address, and phone number. We categorize this as "Order Information."</p>

            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>2. How We Utilize Your Information</h3>
            <p>We use the Order Information primarily to fulfill any orders placed through the Glamshack site. This encompasses processing your payment information with military-grade encryption, arranging for insured and tracked shipping, and providing you with elegant invoices and order confirmations. Beyond immediate fulfillment, we use this Order Information to communicate with you regarding your bespoke orders, screen our transactions for potential risk or fraud, and, when in line with the preferences you have shared with us, provide you with exclusive information or advertising relating to our upcoming luxury collections and seasonal drops.</p>
            <p>The Device Information we collect helps us screen for potential risk and fraud (in particular, your IP address) and, more broadly, to improve and optimize our digital boutique. By generating analytics about how our discerning customers browse and interact with the site, we can evaluate the success of our marketing and design campaigns, ensuring that your digital experience matches the premium quality of our physical products.</p>

            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>3. Data Security & Retention</h3>
            <p>We implement a variety of stringent security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use industry-standard encryption protocols, SSL certificates, and secure payment gateways to ensure your data is protected during transmission. When you place an order through the site, we will maintain your Order Information for our secure records unless and until you ask us to securely delete this information. Your trust is our most valued asset, and we will never sell or rent your personal data to unauthorized third parties.</p>

            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>4. Your Privacy Rights</h3>
            <p>If you are a resident of certain jurisdictions, you have the right to access the personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, or if you have any questions about our privacy practices, please contact our dedicated concierge team at privacy@glamshack.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
