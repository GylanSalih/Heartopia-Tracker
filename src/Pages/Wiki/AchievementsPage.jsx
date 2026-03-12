import React, { useState, useMemo } from 'react';
import { ACHIEVEMENTS, getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const AchievementsPage = () => {
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [checked, toggle, resetAll] = useTrackerState('achievements');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(ACHIEVEMENTS.map((a) => a.category))).sort()],
    []
  );

  const filtered = ACHIEVEMENTS.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    return matchSearch && matchCat;
  });

  const pct = ACHIEVEMENTS.length ? (checked.size / ACHIEVEMENTS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/achievements/Meow-Meow Canteen.avif" alt="Achievements" className={styles.pageIcon} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Achievements</h1>
              <p className={styles.pageSubtitle}>{ACHIEVEMENTS.length} achievements to unlock in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{ACHIEVEMENTS.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <select
              className={styles.filterSelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              className={styles.resetBtn}
              onClick={() => {
              setCategory('All');
              setSearch('');
              resetAll();
            }}
              title="Reset filters"
            >
              Reset
            </button>
            <input
              className={styles.searchInput}
              placeholder="Search achievements…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((ach) => (
            <div
              key={ach.name}
              className={`${styles.card} ${checked.has(ach.name) ? styles.cardChecked : ''}`}
              onClick={() => toggle(ach.name)}
            >
              <div className={styles.cardCheckbox}>
                <input
                  type="checkbox"
                  className={styles.cb}
                  checked={checked.has(ach.name)}
                  onChange={() => toggle(ach.name)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <img
                src={getImgSrc(ach.name, 'achievements')}
                alt={ach.name}
                className={styles.cardImg}
                onError={(e) => { 
                  e.target.style.display = 'none';
                  const soonBadge = document.createElement('span');
                  soonBadge.className = styles.soonBadge;
                  soonBadge.textContent = 'SOON';
                  soonBadge.style.display = 'block';
                  soonBadge.style.margin = '0 auto 10px';
                  if (!e.target.parentElement.querySelector(`.${styles.soonBadge}`)) {
                    e.target.parentElement.appendChild(soonBadge);
                  }
                }}
              />
              <div className={styles.cardTitle}>{ach.name}</div>
              <span className={styles.badge}>{ach.category}</span>
              {ach.requirement && (
                <div className={styles.meta} style={{ marginTop: '8px' }}>
                  <span><strong>Req:</strong> {ach.requirement}</span>
                </div>
              )}
              {ach.description && (
                <p className={styles.cardBody} style={{ marginTop: '6px', textAlign: 'center', fontSize: '0.74rem' }}>
                  {ach.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
