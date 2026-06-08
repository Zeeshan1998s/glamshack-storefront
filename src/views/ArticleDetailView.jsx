import { useParams, useNavigate } from 'react-router-dom';

const ARTICLES_DB = {
  platter: {
    title: "The Art of Curating the Perfect Engagement Platter",
    category: "Bespoke Gifting",
    date: "June 08, 2026",
    author: "By Evelyn Rose",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&auto=format&fit=crop",
    body: `
      <p><span class="dropcap">E</span>ngagement platters are the visual highlight of a modern traditional wedding. Curating the perfect platter is not simply about stacking gifts—it is an exercise in symmetry, materials, and aesthetic storytelling.</p>
      <p>Start by selecting a luxury theme. Deep charcoal tray bases combined with gold-trimmed borders provide a striking modern contrast. Lay a soft velvet lining inside to protect the gifts and give the presentation a textured, premium weight. Arrange the primary elements (like rings or jewelry cases) in the center, and frame them with smaller accessories or fresh floral accents.</p>
      <p>Color coordination is critical. Match the box wraps and ribbon details to the wedding attire. At Glamshack, our platters combine handcrafted zardosi embroidery with modern polished borders, creating an unboxing experience that feels like a ceremony in itself.</p>
    `
  },
  beauty: {
    title: "Cruelty-Free Ingredients: Why Luxury is Going Clean",
    category: "Clean Beauty",
    date: "May 24, 2026",
    author: "By Dr. Sarah Sterling",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop",
    body: `
      <p><span class="dropcap">L</span>uxury beauty is undergoing a massive revolution. Today's consumer does not want to choose between high-pigment performance and conscious, cruelty-free vegan ingredients. The modern luxury market demands both.</p>
      <p>Eliminating animal testing and synthetic chemicals from premium formulas actually opens up a world of rich, nourishing plant-based alternatives. Botanical oils, natural mineral pigments, and organic rose extracts deliver deep skin nourishment alongside flawless cosmetic presentation.</p>
      <p>Glamshack products are formulated with 100% vegan, clean botanical complexes. Combined with zero-waste metal compacts and refillable glass packaging, we ensure that conscious beauty remains a premium sensory delight.</p>
    `
  },
  trends: {
    title: "Saree Box Trends for the Modern Trousseau",
    category: "Wedding Trends",
    date: "April 12, 2026",
    author: "By Kabir Hanif",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop",
    body: `
      <p><span class="dropcap">T</span>he wedding trousseau packaging is undergoing a modern transformation. Traditionally plain, today's saree boxes are fashion statements in their own right, combining rich fabrics, custom monogramming, and structural durability.</p>
      <p>This season, we are seeing a shift away from overly bright reds toward subtle, sophisticated colors. Royal lilac, soft jade, and midnight mirage are popular pastel and deep palettes. Adding customized gold foil monograms or custom Zardosi borders makes the boxes highly personal keepsakes.</p>
      <p>Our hand-built saree boxes utilize heavy sustainable chipboard bases lined with raw silk and velvet, ensuring that the garments are preserved beautifully for years to come.</p>
    `
  }
};

export default function ArticleDetailView() {
  const { articleKey } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES_DB[articleKey];

  if (!article) {
    return (
      <div className="container pdp-wrapper">
        <button className="btn-back" onClick={() => navigate('/blog')}>
          ← Back to Journal
        </button>
        <p style={{ marginTop: '40px' }}>Article not found.</p>
      </div>
    );
  }

  return (
    <div id="view-article-detail" className="page-view active-view">
      <div className="container pdp-wrapper">
        <button className="btn-back" onClick={() => navigate('/blog')}>
          ← Back to Journal
        </button>

        <div className="article-detail-layout" id="article-detail-content">
          <header className="article-header">
            <span className="article-meta">
              {article.category} • {article.date}
            </span>
            <h1 className="article-title">{article.title}</h1>
            <span className="article-author">{article.author}</span>
          </header>
          <div className="article-hero-img-box">
            <img className="article-hero-img" src={article.img} alt={article.title} />
          </div>
          <div
            className="article-body-content"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>
      </div>
    </div>
  );
}
