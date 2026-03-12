import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RECIPES, STAR_MULT, getImgSrc, fmtPrice } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const STARS = [1, 2, 3, 4, 5];

const RecipesPage = () => {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [star, setStar]       = useState(1);
  const [checked, toggle]     = useTrackerState('recipes');
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedItem, setHighlightedItem] = useState(null);
  const highlightedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      setHighlightedItem(highlight);
      // Scroll to highlighted item after render
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

  const handleIngredientClick = (ingredient) => {
    // Navigate to crops page with highlight
    navigate(`/wiki/crops?highlight=${encodeURIComponent(ingredient)}`);
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const thClass = (col) =>
    `${styles.thSort} ${sortCol === col ? (sortDir === 'asc' ? styles.thAsc : styles.thDesc) : ''}`;

  const starPrice = (base) =>
    base != null ? Math.round(base * STAR_MULT[star - 1]) : null;

  const filtered = useMemo(() =>
    RECIPES.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.ingredients && r.ingredients.toLowerCase().includes(search.toLowerCase()))
    ),
    [search]
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = sortCol === 'price' ? starPrice(a.price) : (a[sortCol] ?? '');
      let bv = sortCol === 'price' ? starPrice(b.price) : (b[sortCol] ?? '');
      if (sortCol === 'price') {
        av = av ?? -1; bv = bv ?? -1;
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortCol, sortDir, star]);

  const pct = RECIPES.length ? (checked.size / RECIPES.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/recipes/Tiramisu.avif" alt="Recipes" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Recipes</h1>
              <p className={styles.pageSubtitle}>{RECIPES.length} recipes to cook in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{RECIPES.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <div className={styles.starSelector}>
              <span className={styles.starLabel}>Preis:</span>
              {STARS.map((s) => (
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
              placeholder="Search recipes…"
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
                <th className={thClass('level')} onClick={() => handleSort('level')}>Lv.<span className={styles.sortArrow}/></th>
                <th>Zutaten</th>
                <th>Freischalten</th>
                <th className={thClass('price')} onClick={() => handleSort('price')}>Preis {star}★<span className={styles.sortArrow}/></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((recipe) => (
                <tr 
                  key={recipe.name} 
                  ref={highlightedItem === recipe.name ? highlightedRef : null}
                  className={`${checked.has(recipe.name) ? styles.checkedRow : ''} ${highlightedItem === recipe.name ? styles.highlightedRow : ''}`} 
                  onClick={() => toggle(recipe.name)} 
                  style={{ cursor: 'pointer' }}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className={styles.cb} checked={checked.has(recipe.name)} onChange={() => toggle(recipe.name)} />
                  </td>
                  <td className={styles.imgCell}>
                    <img 
                      src={getImgSrc(recipe.name, 'recipes')} 
                      alt={recipe.name} 
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
                  <td>{recipe.name}</td>
                  <td><span className={styles.badge}>{recipe.level != null ? `Lv ${recipe.level}` : '—'}</span></td>
                  <td onClick={(e) => e.stopPropagation()} style={{ fontSize: '0.78rem', maxWidth: '220px' }}>
                    {recipe.ingredients && recipe.ingredients.split(',').map((ing, idx) => {
                      const ingredient = ing.trim();
                      return (
                        <React.Fragment key={idx}>
                          {idx > 0 && ', '}
                          <span 
                            onClick={() => handleIngredientClick(ingredient)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            title={`Go to ${ingredient}`}
                          >
                            {ingredient}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </td>
                  <td className={styles.timeDim}>{recipe.unlock}</td>
                  <td>
                    {recipe.price != null
                      ? <span className={styles.starBadge}>{fmtPrice(starPrice(recipe.price))}</span>
                      : '—'}
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
