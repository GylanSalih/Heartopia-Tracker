import React, { useState, useMemo } from 'react';
import { RECIPES, getImgSrc, fmtPrice } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const RecipesPage = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      RECIPES.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.ingredients && r.ingredients.toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Recipes</h1>
          <p className={styles.pageSubtitle}>{RECIPES.length} recipes to cook in Heartopia</p>
        </div>

        <input
          type="text"
          placeholder="Search recipes or ingredients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: '1.25rem',
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

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.imgCell}></th>
                <th>Name</th>
                <th>Ingredients</th>
                <th>Unlock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe) => (
                <tr key={recipe.name}>
                  <td className={styles.imgCell}>
                    <img
                      src={getImgSrc(recipe.name, 'recipes')}
                      alt={recipe.name}
                      className={styles.itemImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </td>
                  <td>{recipe.name}</td>
                  <td>{recipe.ingredients}</td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(232,237,245,0.6)' }}>{recipe.unlock}</td>
                  <td>
                    {recipe.price != null ? (
                      <span className={styles.starBadge}>{fmtPrice(recipe.price)}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
