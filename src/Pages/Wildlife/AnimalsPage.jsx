import React, { useState } from 'react';
import { ANIMALS, getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const AnimalsPage = () => {
  const [search, setSearch] = useState('');
  const [checked, toggle]   = useTrackerState('animals');

  const filtered = ANIMALS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(search.toLowerCase()))
  );

  const pct = ANIMALS.length ? (checked.size / ANIMALS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/animals/bunny.avif" alt="Animals" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Animals</h1>
              <p className={styles.pageSubtitle}>{ANIMALS.length} animals you can raise or befriend in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.tbActions}>
            <input
              className={styles.searchInput}
              placeholder="Search animals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.gridWide}>
          {filtered.map((animal) => (
            <div
              key={animal.name}
              className={styles.cardWide}
            >
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(animal.name, 'animals')}
                  alt={animal.name}
                  className={styles.cardImgWide}
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
                <div>
                  <div className={styles.cardTitle}>{animal.name}</div>
                  <div className={styles.cardRole}>{animal.category}</div>
                </div>
              </div>
              <p className={styles.cardBody}>{animal.description}</p>
              <div className={styles.meta}>
                <span><strong>Food:</strong> {animal.food}</span>
                <span><strong>How to get:</strong> {animal.howToGet}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalsPage;
