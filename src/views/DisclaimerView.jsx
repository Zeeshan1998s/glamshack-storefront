import React from 'react';

export default function DisclaimerView() {
  return (
    <div id="view-disclaimer" className="page-view active-view" style={{ paddingTop: 0 }}>
      
      {/* Full Width Hero Section */}
      <div style={{ position: 'relative', width: '100%', height: '40vh', minHeight: '300px', marginBottom: '0', backgroundColor: '#333b24', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <span className="article-meta" style={{ color: '#e5c158', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 500 }}>Glamshack Legal & Privacy</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', margin: 0, fontWeight: 300, lineHeight: 1.15 }}>Disclaimer</h1>
      </div>

      <div className="pdp-wrapper" style={{ width: '100%', paddingBottom: '80px', paddingTop: '80px' }}>
        <div className="container">
          <div className="article-body-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p><span className="dropcap">T</span>he information provided by Glamshack ("we," "us," or "our") on our digital boutique and associated platforms is intended for general informational purposes only. We proudly curate and design premium, bespoke gifting solutions and cosmetics packaging. While we endeavor to keep all information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.</p>
            
            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>1. Artisanal & Handcrafted Variations</h3>
            <p>The true essence of Glamshack lies in our handcrafted, artisanal approach to luxury packaging. Because many of our items—such as our velvet ring platters, zardosi-embroidered cases, and bespoke cosmetic boxes—are made by hand by master craftsmen, slight variations in color, texture, structural finish, and precise measurements may occur. These variations are an inherent and celebrated hallmark of handmade quality, making each piece uniquely yours. They should not be misconstrued as manufacturing defects or flaws. Furthermore, while we invest heavily in high-definition photography to display our products as accurately as possible, we cannot guarantee that the color displayed on your specific monitor or device will precisely match the physical item.</p>

            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>2. Professional Advice Disclaimer</h3>
            <p>Any content found on the Glamshack site, including our Journal entries regarding wedding trends, beauty routines, and trousseau packing, is provided for aesthetic inspiration and general knowledge. It does not constitute professional event planning, legal, or dermatological advice. Reliance on any information provided by Glamshack, our employees, or others appearing on the site at our invitation is solely at your own risk. For specialized advice regarding skin sensitivities to specific cosmetic ingredients or large-scale event logistics, we recommend consulting directly with certified professionals in those fields.</p>

            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>3. External Links & Third-Party Affiliations</h3>
            <p>Through this website, you may be able to link to other websites or third-party content which are not under the control of Glamshack. We have no control over the nature, content, and availability of those external sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. We cannot be held liable for any damages or losses related to the use of any external websites linked to or from our digital boutique.</p>
            
            <h3 className="about-subtitle" style={{ marginTop: '40px', fontSize: '24px' }}>4. Limitation of Liability</h3>
            <p>In no event will Glamshack be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. Every effort is made to keep the website up and running smoothly. However, Glamshack takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our immediate control.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
