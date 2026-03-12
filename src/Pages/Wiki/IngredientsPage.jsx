import React, { useState, useMemo } from 'react';
import { INGREDIENTS, getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const IngredientsPage = () => {
  const [search, setSearch] = useState('');
  const [checked, toggle]   = useTrackerState('ingredients');

  const filtered = useMemo(() =>
    INGREDIENTS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const pct = INGREDIENTS.length ? (checked.size / INGREDIENTS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/ingredients/Cheese.avif" alt="Ingredients" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Ingredients</h1>
              <p className={styles.pageSubtitle}>{INGREDIENTS.length} cooking ingredients in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{INGREDIENTS.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <input
              className={styles.searchInput}
              placeholder="Search ingredients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.list}>
          {filtered.map((item) => (
            <div
              key={item.name}
              className={`${styles.listItem} ${checked.has(item.name) ? styles.listItemChecked : ''}`}
              onClick={() => toggle(item.name)}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                className={styles.cb}
                checked={checked.has(item.name)}
                onChange={() => toggle(item.name)}
                onClick={(e) => e.stopPropagation()}
              />
              <img
                src={getImgSrc(item.name, 'ingredients')}
                alt={item.name}
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
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;
