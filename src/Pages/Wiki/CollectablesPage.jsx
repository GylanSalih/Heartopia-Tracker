import React, { useState } from 'react';
import { COLLECTABLES, getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const CollectablesPage = () => {
  const [search, setSearch] = useState('');
  const [checked, toggle]   = useTrackerState('collectables');

  const filtered = COLLECTABLES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.type && c.type.toLowerCase().includes(search.toLowerCase()))
  );

  const pct = COLLECTABLES.length ? (checked.size / COLLECTABLES.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/collectables/Quality Timber.avif" alt="Collectables" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Collectables</h1>
              <p className={styles.pageSubtitle}>{COLLECTABLES.length} collectables to find in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{COLLECTABLES.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <input
              className={styles.searchInput}
              placeholder="Search collectables…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((item) => (
            <div
              key={item.name}
              className={`${styles.card} ${checked.has(item.name) ? styles.cardChecked : ''}`}
              onClick={() => toggle(item.name)}
            >
              <div className={styles.cardCheckbox}>
                <input
                  type="checkbox"
                  className={styles.cb}
                  checked={checked.has(item.name)}
                  onChange={() => toggle(item.name)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <img
                src={getImgSrc(item.name, 'collectables')}
                alt={item.name}
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
              <div className={styles.cardTitle}>{item.name}</div>
              {item.type && <div className={styles.cardRole}>{item.type}</div>}
              {item.source && (
                <div className={styles.meta} style={{ marginTop: '8px' }}>
                  <span><strong>Source:</strong> {item.source}</span>
                </div>
              )}
              {item.description && (
                <p className={styles.cardBody} style={{ marginTop: '6px', textAlign: 'center', fontSize: '0.74rem' }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectablesPage;
