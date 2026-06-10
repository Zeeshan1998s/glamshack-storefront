import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionHeader from '../components/CollectionHeader';
import CollectionFilterBar from '../components/CollectionFilterBar';
import ProductGrid from '../components/ProductGrid';
import './CollectionsView.css';

export default function CollectionsView() {
  const [searchParams] = useSearchParams();
  const [productCount, setProductCount] = useState(0);

  const activeShopFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [gridView, setGridView] = useState('default');
  const [visibleCount, setVisibleCount] = useState(28);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 28);
  };

  useEffect(() => {
    let intervalId;
    let observer;
    let shadowObserver;

    const applyProductFilter = () => {
      const shopList = document.getElementById('collection-list-context');
      if (!shopList) return;

      const cards = [];
      cards.push(...shopList.querySelectorAll('.leather-family-card'));
      if (shopList.shadowRoot) {
        cards.push(...shopList.shadowRoot.querySelectorAll('.leather-family-card'));
      }

      if (cards.length === 0) {
        setProductCount(0);
        return;
      }

      let matchCount = 0;
      const trimmedSearch = searchQuery.toLowerCase();
      const colorFilter = selectedColor.toLowerCase();
      const styleFilter = selectedStyle.toLowerCase();

      cards.forEach((card) => {
        const attrTitle = card.getAttribute('data-title') || card.getAttribute('shopify-attr--data-title') || '';
        const htmlTitle = card.querySelector('.card-title')?.innerText || '';
        const title = (attrTitle || htmlTitle).toLowerCase();

        // Category Filter
        let matchesCategory = false;
        if (activeShopFilter === 'all') {
          matchesCategory = true;
        } else if (activeShopFilter === 'hampers') {
          matchesCategory = ['hamper', 'trousseau', 'set', 'gift'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'trays') {
          matchesCategory = ['tray', 'platter', 'thali', 'shagun', 'ring'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'saree-covers') {
          matchesCategory = ['saree', 'cover', 'suit', 'lehenga', 'gown', 'sherwani'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'bags') {
          matchesCategory = ['bag', 'potli', 'envelope', 'clutch', 'purse'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'baskets') {
          matchesCategory = ['basket', 'trunk', 'box', 'baksa'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'pouches') {
          matchesCategory = ['pouch', 'organizer', 'kit', 'case'].some((kw) => title.includes(kw));
        } else if (activeShopFilter === 'bands') {
          matchesCategory = ['band', 'bangle', 'necklace', 'set', 'earring', 'choker', 'pendant', 'jewelry'].some((kw) => title.includes(kw));
        }

        const matchesSearch = title.includes(trimmedSearch);

        let matchesDiscount = true;
        if (isDiscountActive) {
          const priceText = card.querySelector('.price-new')?.innerText || '';
          const compareText = card.querySelector('.price-old')?.innerText || '';
          const extractNum = (str) => {
             const matches = str.replace(/,/g, '').match(/[\d.]+/);
             return matches ? parseFloat(matches[0]) : 0;
          };
          const currentPrice = extractNum(priceText);
          const comparePrice = extractNum(compareText);
          if (comparePrice <= currentPrice || currentPrice === 0) {
            matchesDiscount = false;
          }
        }

        let matchesColor = true;
        if (colorFilter) {
          matchesColor = title.includes(colorFilter);
        }

        let matchesStyle = true;
        if (styleFilter) {
          matchesStyle = title.includes(styleFilter);
        }

        if (matchesCategory && matchesSearch && matchesDiscount && matchesColor && matchesStyle) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      setProductCount(matchCount);
    };

    applyProductFilter();
    intervalId = setInterval(applyProductFilter, 800);

    const shopList = document.getElementById('collection-list-context');
    if (shopList) {
      observer = new MutationObserver(applyProductFilter);
      observer.observe(shopList, { childList: true, subtree: true });
      if (shopList.shadowRoot) {
        shadowObserver = new MutationObserver(applyProductFilter);
        shadowObserver.observe(shopList.shadowRoot, { childList: true, subtree: true });
      }
    }

    return () => {
      clearInterval(intervalId);
      if (observer) observer.disconnect();
      if (shadowObserver) shadowObserver.disconnect();
    };
  }, [activeShopFilter, searchQuery, isDiscountActive, selectedColor, selectedStyle]);

  return (
    <div id="view-collections" className="page-view active-view" style={{ backgroundColor: '#f6f5f3' }}>
      
      {/* Header with Title and Subcategories */}
      <CollectionHeader />

      {/* Filter and Sort Bar */}
      <CollectionFilterBar 
        isDiscountActive={isDiscountActive} setIsDiscountActive={setIsDiscountActive}
        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
        selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle}
        activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown}
        gridView={gridView} setGridView={setGridView}
      />

      {/* Grid of Products */}
      <ProductGrid activeCategory={activeShopFilter} gridView={gridView} visibleCount={visibleCount} />

      {/* Load More Button */}
      <div className="collection-load-more-container">
        <button className="collection-load-more-btn" onClick={handleLoadMore}>LOAD MORE ({productCount} items)</button>
      </div>

      {/* Pre-footer Landscape Image */}
      <section className="home-pre-footer">
        <img
          src="https://images.unsplash.com/photo-1513689125086-6c432170e843?w=2000&auto=format&fit=crop"
          alt="Mountains and Forests"
          style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }}
        />
      </section>
    </div>
  );
}
