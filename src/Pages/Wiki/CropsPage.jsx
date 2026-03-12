import React, { useState } from 'react';
import { getImgSrc } from '../Tracker/data/trackerData';
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
  const [search, setSearch] = useState('');

  const filtered = CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.recipes.some((r) => r.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Crops</h1>
          <p className={styles.pageSubtitle}>{CROPS.length} crops available to grow in Heartopia</p>
        </div>

        <input
          type="text"
          placeholder="Search crops or recipes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: '1.5rem',
            padding: '0.5rem 0.9rem',
            borderRadius: '0.4rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#0d1f3c',
            color: '#e8edf5',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            width: '100%',
            maxWidth: '360px',
          }}
        />

        <div className={styles.grid}>
          {filtered.map((crop) => (
            <div key={crop.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(crop.name, 'gardening')}
                  alt={crop.name}
                  className={styles.cardImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className={styles.cardTitle}>{crop.name}</div>
                  <div className={styles.cardRole}>
                    {crop.isTree ? 'Tree Crop' : `${crop.growthTime} growth`}
                  </div>
                </div>
              </div>

              <div className={styles.meta}>
                <span><strong>Seed Price:</strong> {crop.seedPrice}</span>
                <span><strong>Unlock:</strong> Lv {crop.level}</span>
                <span><strong>Growth Time:</strong> {crop.growthTime}</span>
              </div>

              <div className={styles.starRow}>
                {crop.stars.map((val, i) => (
                  <span key={i} className={styles.starBadge}>
                    {STAR_LABELS[i]}: {val}
                  </span>
                ))}
              </div>

              {crop.recipes.length > 0 && (
                <div className={styles.tags}>
                  {crop.recipes.map((r) => (
                    <span key={r} className={styles.tag}>{r}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropsPage;
