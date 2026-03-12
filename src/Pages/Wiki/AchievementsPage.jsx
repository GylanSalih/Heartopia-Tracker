import React, { useState, useMemo } from 'react';
import { ACHIEVEMENTS, getImgSrc } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const AchievementsPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

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

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Achievements</h1>
          <p className={styles.pageSubtitle}>{ACHIEVEMENTS.length} achievements to unlock in Heartopia</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search achievements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '0.4rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0d1f3c',
              color: '#e8edf5',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.875rem',
              width: '100%',
              maxWidth: '280px',
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '0.4rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0d1f3c',
              color: '#e8edf5',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.grid}>
          {filtered.map((ach) => (
            <div key={ach.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(ach.name, 'achievements')}
                  alt={ach.name}
                  className={styles.cardImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className={styles.cardTitle}>{ach.name}</div>
                  <span className={styles.badge}>{ach.category}</span>
                </div>
              </div>
              {ach.requirement && (
                <div className={styles.meta}>
                  <span><strong>Requirement:</strong> {ach.requirement}</span>
                </div>
              )}
              <p className={styles.cardBody} style={{ marginTop: '0.5rem' }}>{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
