import { useSearchParams } from 'react-router-dom';
import BrocadeBox from '../assets/categories/brocade.png';
import Tray from '../assets/categories/trays.png';
// import SweetBox from '../assets/categories/sweet-boxes.png';
import AllProducts from "../assets/categories/Haldi-Mehendi Giveaways.png";
import EngagementPlatters from '../assets/categories/eng-platter.png';
import FruitBaskets from "../assets/categories/Fruit-baskets.png"
import HaldiPlatter from '../assets/categories/Haldi Platter.png';
import LuggageBands from '../assets/categories/Luggage bands.png';
import MehendiPlatters from '../assets/categories/Mehendi Platters.png';
// import SareeBands from '../assets/Saree bands.png';
// import DryFruitTrays from '../assets/Dry Fruit Trays.png';
// import TrousseauSets from '../assets/Trousseau sets.png';
import TrunksSaasKaBaksa from '../assets/categories/trunks.png';
import Nikahnama from '../assets/categories/Nikahnama.png';
import HaldiMehendi from '../assets/categories/Haldi-Mehendi Giveaways.png';

const CATEGORIES = [
  { id: 'all', label: 'All Products', img: AllProducts },
  { id: 'brocade-boxes', label: 'Brocade Boxes', img: BrocadeBox },
  { id: 'trays', label: 'Trays', img: Tray },
  // { id: 'sweet-boxes', label: 'Sweet Boxes', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'nikahnama', label: 'Nikahnama', img: Nikahnama },
  { id: 'engagement-platters', label: 'Engagement Platters', img: EngagementPlatters },
  { id: 'fruit-hamper-baskets', label: 'Fruit/ Hamper baskets', img: FruitBaskets },
  { id: 'haldi-platter', label: 'Haldi Platter', img: HaldiPlatter },
  { id: 'haldi-mehendi', label: 'Haldi/Mehendi', img: HaldiMehendi },
  { id: 'luggage-bands', label: 'Luggage bands', img: LuggageBands },
  { id: 'mehendi-platters', label: 'Mehendi Platters', img: MehendiPlatters },
  { id: 'saree-bands', label: 'Saree Bands', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50&h=50&fit=crop' },
  { id: 'dry-fruit-trays', label: 'Dry Fruit Trays', img: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=50&h=50&fit=crop' },
  { id: 'trousseau-sets', label: 'Trousseau sets', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
  { id: 'trunks-saas-ka-baksa', label: 'Trunks/ Saas Ka Baksa', img: TrunksSaasKaBaksa },
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
