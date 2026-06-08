import { useNavigate } from 'react-router-dom';

export default function BlogView() {
  const navigate = useNavigate();

  return (
    <div id="view-blog" className="page-view active-view">
      <div className="container profile-wrapper">
        <div className="section-header">
          <span className="section-title-tag">The Glamshack Journal</span>
          <h2 className="section-main-title">Insights & Editorial</h2>
        </div>

        <div className="blog-grid">
          {/* Article Card 1 */}
          <article className="blog-card" onClick={() => navigate('/blog/platter')} style={{ cursor: 'pointer' }}>
            <div className="blog-media">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&amp;auto=format&amp;fit=crop"
                alt="The Art of Gifting platters"
              />
              <span className="blog-category">Bespoke Gifting</span>
            </div>
            <div className="blog-details">
              <span className="blog-date">June 08, 2026</span>
              <h3 className="blog-card-title">The Art of Curating the Perfect Engagement Platter</h3>
              <p className="blog-excerpt">
                Unveiling the steps to organize, color-coordinate, and present luxury wedding ring platters for a magnificent
                visual effect.
              </p>
              <span className="blog-read-btn">Read Article →</span>
            </div>
          </article>

          {/* Article Card 2 */}
          <article className="blog-card" onClick={() => navigate('/blog/beauty')} style={{ cursor: 'pointer' }}>
            <div className="blog-media">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&amp;auto=format&amp;fit=crop"
                alt="Cruelty free cosmetics ingredients"
              />
              <span className="blog-category">Clean Beauty</span>
            </div>
            <div className="blog-details">
              <span className="blog-date">May 24, 2026</span>
              <h3 className="blog-card-title">Cruelty-Free Ingredients: Why Luxury is Going Clean</h3>
              <p className="blog-excerpt">
                Exploring the paradigm shift in high-end cosmetics toward vegan formulas and sustainable zero-waste refill
                packing models.
              </p>
              <span className="blog-read-btn">Read Article →</span>
            </div>
          </article>

          {/* Article Card 3 */}
          <article className="blog-card" onClick={() => navigate('/blog/trends')} style={{ cursor: 'pointer' }}>
            <div className="blog-media">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&amp;auto=format&amp;fit=crop"
                alt="Saree box wrapping design ideas"
              />
              <span className="blog-category">Wedding Trends</span>
            </div>
            <div className="blog-details">
              <span className="blog-date">April 12, 2026</span>
              <h3 className="blog-card-title">Saree Box Trends for the Modern Trousseau</h3>
              <p className="blog-excerpt">
                A styling guide on selecting silk borders, custom embroidery, and pastel themes for luxury saree box packing
                this wedding season.
              </p>
              <span className="blog-read-btn">Read Article →</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
