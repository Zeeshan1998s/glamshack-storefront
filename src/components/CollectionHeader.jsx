import { useSearchParams } from 'react-router-dom';
import BrocadeBox from '../assets/categories/brocade.png';
// import Tray from '../assets/TRAYS.jpg';
// import SweetBox from '../assets/Sweet boxes.jpg';
import EngagementPlatters from '../assets/categories/eng-platter.png';
import FruitBaskets from "../assets/categories/Fruit-baskets.png"
// import HaldiPlatter from '../assets/Haldi Platter.jpg';
// import LuggageBands from '../assets/Luggage bands.jpg';
// import MehendiPlatters from '../assets/Mehendi Platters.jpg';
// import SareeBands from '../assets/Saree bands.jpg';
// import DryFruitTrays from '../assets/Dry Fruit Trays.jpg';
// import TrousseauSets from '../assets/Trousseau sets.jpg';
// import TrunksSaasKaBaksa from '../assets/TrunksSaasKaBaksa.jpg';
// import Nikahnama from '../assets/Nikahnama.jpg';
// import HaldiMehendi from '../assets/HaldiMehendi.jpg';

const CATEGORIES = [
  { id: 'all', label: 'All Products', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop' },
  { id: 'brocade-boxes', label: 'Brocade Boxes', img: BrocadeBox },
  { id: 'trays', label: 'Trays', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'sweet-boxes', label: 'Sweet Boxes', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'nikahnama', label: 'Nikahnama', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop' },
  { id: 'engagement-platters', label: 'Engagement Platters', img: EngagementPlatters },
  { id: 'fruit-hamper-baskets', label: 'Fruit/ Hamper baskets', img: FruitBaskets },
  { id: 'haldi-platter', label: 'Haldi Platter', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'haldi-mehendi', label: 'Haldi/Mehendi', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop' },
  { id: 'luggage-bands', label: 'Luggage bands', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=50&h=50&fit=crop' },
  { id: 'mehendi-platters', label: 'Mehendi Platters', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'saree-bands', label: 'Saree Bands', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop' },
  { id: 'dry-fruit-trays', label: 'Dry Fruit Trays', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'trousseau-sets', label: 'Trousseau sets', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'trunks-saas-ka-baksa', label: 'Trunks/ Saas Ka Baksa', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
];

export default function CollectionHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleFilterChange = (categoryId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('category', categoryId);
      return params;
    });
  };

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="collection-header-container">
      {/* <div className="collection-breadcrumbs">
        HOME / ALL CATEGORIES / {activeCategoryData.label.toUpperCase()}
      </div> */}
      <div className="collection-header-content">
        <h1 className="collection-title">{activeCategoryData.label}</h1>
        <p className="collection-subtitle">
          Explore our exclusive collection of {activeCategoryData.label.toLowerCase()}. Carefully curated for the best quality and design.
        </p>
      </div>
      <div className="collection-subcategories">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`subcategory-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleFilterChange(cat.id)}
            style={{ cursor: 'pointer', opacity: activeCategory === cat.id ? 1 : 0.4 }}
          >
            <img src={cat.img} alt={cat.label} className="subcategory-img" />
            <span className="subcategory-label" style={{ fontWeight: activeCategory === cat.id ? '600' : 'normal' }}>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
