import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const CROPS = [
  {
    name: 'Tomato',
    seedPrice: 10,
    level: 1,
    growthTime: '15 min',
    stars: [30, 40, 50, 60, 70],
    recipes: ['House Salad', 'Mixed Jam', 'Tomato Sauce', 'Seafood Risotto', 'Rustic Ratatouille', 'Meat Sauce Pasta'],
    isTree: false,
  },
  {
    name: 'Potato',
    seedPrice: 30,
    level: 1,
    growthTime: '60 min',
    stars: [90, 120, 150, 180, '~270'],
    recipes: ['Fish and Chips', 'Rustic Ratatouille', 'Mushroom Stew', 'Fish Soup'],
    isTree: false,
  },
  {
    name: 'Wheat',
    seedPrice: 95,
    level: 2,
    growthTime: '4 h',
    stars: [285, 381, 475, 570, 855],
    recipes: ['Smoked Fish Bagel', 'Seafood Risotto', 'Cheesecake', 'Meat Sauce Pasta', 'Seafood Pizza'],
    isTree: false,
  },
  {
    name: 'Lettuce',
    seedPrice: 145,
    level: 3,
    growthTime: '8 h',
    stars: [435, 582, 726, 870, 1017],
    recipes: ['House Salad', 'Rustic Ratatouille', 'Smoked Fish Bagel'],
    isTree: false,
  },
  {
    name: 'Pineapple',
    seedPrice: 15,
    level: 4,
    growthTime: '30 min',
    stars: [52, 69, 86, 104, '~156'],
    recipes: ['Pineapple Jam'],
    isTree: false,
  },
  {
    name: 'Carrot',
    seedPrice: 50,
    level: 5,
    growthTime: '2 h',
    stars: [155, 207, 258, 310, '~465'],
    recipes: ['Carrot Cake', 'Smoked Fish Bagel'],
    isTree: false,
  },
  {
    name: 'Strawberry',
    seedPrice: 125,
    level: 6,
    growthTime: '6 h',
    stars: [375, 502, 626, 750, 1125],
    recipes: ['Strawberry Jam', 'Fruit Salad'],
    isTree: false,
  },
  {
    name: 'Corn',
    seedPrice: 170,
    level: 6,
    growthTime: '12 h',
    stars: [515, 690, 860, 1030, 1545],
    recipes: ['Corn Soup'],
    isTree: false,
  },
  {
    name: 'Grape',
    seedPrice: 160,
    level: 7,
    growthTime: '10 h',
    stars: [480, 643, 801, 960, '~1440'],
    recipes: ['Grape Jam'],
    isTree: false,
  },
  {
    name: 'Eggplant',
    seedPrice: 135,
    level: 8,
    growthTime: '7 h',
    stars: [406, 544, 678, 812, 1218],
    recipes: ['Baked Eggplant with Meat', 'Smoked Fish Bagel'],
    isTree: false,
  },
  {
    name: 'Tea Tree',
    seedPrice: 25,
    level: 11,
    growthTime: 'Tree Crop',
    stars: [75],
    recipes: ['Mellow Black Tea', 'Refreshing Green Tea'],
    isTree: true,
  },
  {
    name: 'Cacao Tree',
    seedPrice: 110,
    level: 12,
    growthTime: 'Tree Crop',
    stars: [330],
    recipes: ['Chocolate Sauce', 'Tiramisu'],
    isTree: true,
  },
  {
    name: 'Avocado',
    seedPrice: 180,
    level: 13,
    growthTime: 'Tree Crop',
    stars: [540],
    recipes: ['Shrimp Avocado Cup'],
    isTree: true,
  },
];

const STAR_LABELS = ['⭐1', '⭐2', '⭐3', '⭐4', '⭐5'];

const CropsPage = () => {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('level');
  const [sortDir, setSortDir] = useState('asc');
  const [star, setStar]       = useState(1);
  const [checked, toggle]     = useTrackerState('crops');
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedItem, setHighlightedItem] = useState(null);
  const highlightedRef = useRef(null);

  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      setHighlightedItem(highlight);
      setTimeout(() => {
        if (highlightedRef.current) {
          highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClick = () => {
      if (highlightedItem) {
        setHighlightedItem(null);
        setSearchParams({});
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [highlightedItem, setSearchParams]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const thClass = (col) =>
    `${styles.thSort} ${sortCol === col ? (sortDir === 'asc' ? styles.thAsc : styles.thDesc) : ''}`;

  const filtered = CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.recipes.some((r) => r.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    let av, bv;
    if (sortCol === 'price') {
      av = typeof a.stars[star - 1] === 'number' ? a.stars[star - 1] : -1;
      bv = typeof b.stars[star - 1] === 'number' ? b.stars[star - 1] : -1;
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    av = a[sortCol] ?? ''; bv = b[sortCol] ?? '';
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const pct = CROPS.length ? (checked.size / CROPS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/Crops/grape.avif" alt="Crops" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Crops</h1>
              <p className={styles.pageSubtitle}>{CROPS.length} crops available to grow in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{CROPS.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <div className={styles.starSelector}>
              <span className={styles.starLabel}>Preis:</span>
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  className={`${styles.starBtn} ${star === s ? styles.starBtnActive : ''}`}
                  onClick={() => setStar(s)}
                >
                  {s}★
                </button>
              ))}
            </div>
            <input
              className={styles.searchInput}
              placeholder="Search crops…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>✓</th>
                <th className={styles.imgCell} />
                <th className={thClass('name')} onClick={() => handleSort('name')}>Name<span className={styles.sortArrow}/></th>
                <th className={thClass('level')} onClick={() => handleSort('level')}>Level<span className={styles.sortArrow}/></th>
                <th className={thClass('growthTime')} onClick={() => handleSort('growthTime')}>Wachstum<span className={styles.sortArrow}/></th>
                <th className={thClass('seedPrice')} onClick={() => handleSort('seedPrice')}>Seed-Preis<span className={styles.sortArrow}/></th>
                <th className={thClass('price')} onClick={() => handleSort('price')}>Ernte {star}★<span className={styles.sortArrow}/></th>
                <th>Rezepte</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((crop) => {
                const harvestVal = crop.stars[star - 1];
                return (
                  <tr 
                    key={crop.name} 
                    ref={highlightedItem === crop.name ? highlightedRef : null}
                    className={`${checked.has(crop.name) ? styles.checkedRow : ''} ${highlightedItem === crop.name ? styles.highlightedRow : ''}`} 
                    onClick={() => toggle(crop.name)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className={styles.cb} checked={checked.has(crop.name)} onChange={() => toggle(crop.name)} />
                    </td>
                    <td className={styles.imgCell}>
                      <img 
                        src={getImgSrc(crop.name, 'gardening')} 
                        alt={crop.name} 
                        className={styles.itemImg} 
                        onError={(e) => { 
                          e.target.style.display = 'none';
                          const soonBadge = document.createElement('span');
                          soonBadge.className = styles.soonBadge;
                          soonBadge.textContent = 'SOON';
                          if (!e.target.parentElement.querySelector(`.${styles.soonBadge}`)) {
                            e.target.parentElement.appendChild(soonBadge);
                          }
                        }} 
                      />
                    </td>
                    <td>{crop.name}{crop.isTree && <span className={styles.badge} style={{ marginLeft: '6px' }}>Tree</span>}</td>
                    <td style={{ textAlign: 'center' }}><span className={styles.badge}>Lv {crop.level}</span></td>
                    <td className={styles.timeDim}>{crop.growthTime}</td>
                    <td className={styles.starBadge}>{crop.seedPrice}</td>
                    <td>
                      {typeof harvestVal === 'number'
                        ? <span className={styles.starBadge}>{harvestVal}</span>
                        : '—'}
                    </td>
                    <td style={{ fontSize: '0.74rem', color: '#7a9cc6', maxWidth: '180px' }}>
                      {crop.recipes.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CropsPage;
