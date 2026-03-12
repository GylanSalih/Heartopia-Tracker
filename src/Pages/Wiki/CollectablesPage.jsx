import React, { useState } from 'react';
import { COLLECTABLES, getImgSrc } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const CollectablesPage = () => {
  const [search, setSearch] = useState('');

  const filtered = COLLECTABLES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.type && c.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Collectables</h1>
          <p className={styles.pageSubtitle}>{COLLECTABLES.length} collectables to find in Heartopia</p>
        </div>

        <input
          type="text"
          placeholder="Search collectables…"
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
          {filtered.map((item) => (
            <div key={item.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(item.name, 'collectables')}
                  alt={item.name}
                  className={styles.cardImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className={styles.cardTitle}>{item.name}</div>
                  {item.type && <div className={styles.cardRole}>{item.type}</div>}
                </div>
              </div>
              {item.source && (
                <div className={styles.meta}>
                  <span><strong>Source:</strong> {item.source}</span>
                </div>
              )}
              {item.description && (
                <p className={styles.cardBody} style={{ marginTop: '0.5rem' }}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectablesPage;
