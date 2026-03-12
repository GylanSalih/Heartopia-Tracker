import React, { useState, useMemo } from 'react';
import { INSECTS, getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const wClass = (w) => {
  if (!w || w === 'Any') return styles.waAny;
  const l = w.toLowerCase();
  if (l.includes('rainbow')) return styles.waRainbow;
  if (l.includes('rain'))    return styles.waRain;
  if (l.includes('sunny'))   return styles.waSunny;
  return styles.waAny;
};

const InsectsPage = () => {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [checked, toggle, resetAll] = useTrackerState('insects');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const thClass = (col) =>
    `${styles.thSort} ${sortCol === col ? (sortDir === 'asc' ? styles.thAsc : styles.thDesc) : ''}`;

  const filtered = useMemo(() =>
    INSECTS.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? ''; const bv = b[sortCol] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    }),
    [filtered, sortCol, sortDir]
  );

  const groupedByLevel = useMemo(() => {
    const groups = {};
    sorted.forEach((insect) => {
      const level = insect.level || 1;
      if (!groups[level]) groups[level] = [];
      groups[level].push(insect);
    });
    return Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .map((level) => ({ level: Number(level), items: groups[level] }));
  }, [sorted]);

  const pct = INSECTS.length ? (checked.size / INSECTS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/insects/Cicada.avif" alt="Insects" className={styles.pageIcon} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Insects</h1>
              <p className={styles.pageSubtitle}>{INSECTS.length} insects found in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{INSECTS.length}</span>
            <div className={styles.progOuter}>
              <div className={styles.progInner} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.tbActions}>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearch('');
                setSortCol('name');
                setSortDir('asc');
                resetAll();
              }}
              title="Reset filters and sorting"
            >
              Reset
            </button>
            <input
              className={styles.searchInput}
              placeholder="Search insects…"
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
                <th className={thClass('location')} onClick={() => handleSort('location')}>Ort<span className={styles.sortArrow}/></th>
                <th className={thClass('weather')} onClick={() => handleSort('weather')}>Wetter<span className={styles.sortArrow}/></th>
                <th className={thClass('time')} onClick={() => handleSort('time')}>Zeit<span className={styles.sortArrow}/></th>
              </tr>
            </thead>
            <tbody>
              {groupedByLevel.map((group) => (
                <React.Fragment key={`level-${group.level}`}>
                  <tr className={styles.levelGroupHeader}>
                    <td colSpan="7">
                      <div className={styles.levelGroupTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.heartIcon}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Level {group.level}
                      </div>
                    </td>
                  </tr>
                  {group.items.map((insect) => (
                    <tr key={insect.name} className={checked.has(insect.name) ? styles.checkedRow : ''} onClick={() => toggle(insect.name)} style={{ cursor: 'pointer' }}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={styles.cb}
                          checked={checked.has(insect.name)}
                          onChange={() => toggle(insect.name)}
                        />
                      </td>
                      <td className={styles.imgCell}>
                        <img
                          src={getImgSrc(insect.name, 'insects')}
                          alt={insect.name}
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
                      <td>{insect.name}</td>
                      <td><span className={styles.badge}>Lv {insect.level}</span></td>
                      <td>{insect.location}</td>
                      <td><span className={`${styles.weatherBadge} ${wClass(insect.weather)}`}>{insect.weather}</span></td>
                      <td className={styles.timeDim}>{insect.time}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsectsPage;