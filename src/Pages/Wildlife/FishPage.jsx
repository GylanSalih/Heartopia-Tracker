import React, { useState, useMemo } from 'react';
import { FISH, STAR_MULT, getImgSrc, fmtPrice } from '../Tracker/data/trackerData';
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

// Shadow sort order for consistent sorting
const SHADOW_ORDER = { small: 1, medium: 2, big: 3, blue: 4, gold: 5, none: 6 };

const ShadowCell = ({ shadow }) => {
  if (!shadow || shadow === 'none') {
    return <span className={styles.shadowNone}>/</span>;
  }
  return (
    <img
      src={`/assets/img/fishshadow/${shadow}.png`}
      alt={shadow}
      className={styles.shadowImg}
      onError={(e) => {
        e.target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = styles.shadowNone;
        fallback.textContent = shadow;
        if (!e.target.parentElement.querySelector(`.${styles.shadowNone}`)) {
          e.target.parentElement.appendChild(fallback);
        }
      }}
    />
  );
};

const STARS = [1, 2, 3, 4, 5];

const FishPage = () => {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [star, setStar]       = useState(1);
  const [checked, toggle, resetAll] = useTrackerState('fish');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const thClass = (col) =>
    `${styles.thSort} ${sortCol === col ? (sortDir === 'asc' ? styles.thAsc : styles.thDesc) : ''}`;

  const starPrice = (base) =>
    base != null ? Math.round(base * STAR_MULT[star - 1]) : null;

  const filtered = useMemo(() =>
    FISH.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortCol === 'shadow') {
        const av = SHADOW_ORDER[a.shadow] ?? 99;
        const bv = SHADOW_ORDER[b.shadow] ?? 99;
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      let av = sortCol === 'price' ? starPrice(a.price) : (a[sortCol] ?? '');
      let bv = sortCol === 'price' ? starPrice(b.price) : (b[sortCol] ?? '');
      if (typeof av === 'number' || sortCol === 'price') {
        av = av ?? -1; bv = bv ?? -1;
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortCol, sortDir, star]);

  const groupedByLevel = useMemo(() => {
    // Only group by level when NOT sorting by a column other than name/level
    const groups = {};
    sorted.forEach((fish) => {
      const level = fish.level || 1;
      if (!groups[level]) groups[level] = [];
      groups[level].push(fish);
    });
    return Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .map((level) => ({ level: Number(level), items: groups[level] }));
  }, [sorted]);

  const pct = FISH.length ? (checked.size / FISH.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/fish/Goldfish.avif" alt="Fish" className={styles.pageIcon} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>Fish</h1>
              <p className={styles.pageSubtitle}>{FISH.length} fish species to catch in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.progWrap}>
            <span className={styles.progText}>{checked.size}/{FISH.length}</span>
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
              placeholder="Search fish…"
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
                <th className={thClass('name')}    onClick={() => handleSort('name')}>Name<span className={styles.sortArrow}/></th>
                <th className={thClass('level')}   onClick={() => handleSort('level')}>Level<span className={styles.sortArrow}/></th>
                <th className={thClass('location')}onClick={() => handleSort('location')}>Ort<span className={styles.sortArrow}/></th>
                <th className={thClass('weather')} onClick={() => handleSort('weather')}>Wetter<span className={styles.sortArrow}/></th>
                <th className={thClass('time')}    onClick={() => handleSort('time')}>Zeit<span className={styles.sortArrow}/></th>
                <th className={thClass('shadow')}  onClick={() => handleSort('shadow')}>Schatten<span className={styles.sortArrow}/></th>
                <th className={thClass('price')}   onClick={() => handleSort('price')}>Preis {star}★<span className={styles.sortArrow}/></th>
              </tr>
            </thead>
            <tbody>
              {groupedByLevel.map((group) => (
                <React.Fragment key={`level-${group.level}`}>
                  <tr className={styles.levelGroupHeader}>
                    <td colSpan="9">
                      <div className={styles.levelGroupTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.heartIcon}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Level {group.level}
                      </div>
                    </td>
                  </tr>
                  {group.items.map((fish) => (
                    <tr key={fish.name} className={checked.has(fish.name) ? styles.checkedRow : ''} onClick={() => toggle(fish.name)} style={{ cursor: 'pointer' }}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className={styles.cb} checked={checked.has(fish.name)} onChange={() => toggle(fish.name)} />
                      </td>
                      <td className={styles.imgCell}>
                        <img
                          src={getImgSrc(fish.name, 'fish')}
                          alt={fish.name}
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
                      <td>{fish.name}</td>
                      <td><span className={styles.badge}>Lv {fish.level}</span></td>
                      <td>{fish.location}</td>
                      <td><span className={`${styles.weatherBadge} ${wClass(fish.weather)}`}>{fish.weather}</span></td>
                      <td className={styles.timeDim}>{fish.time}</td>
                      <td className={styles.shadowCell}>
                        <ShadowCell shadow={fish.shadow} />
                      </td>
                      <td>
                        {fish.price != null
                          ? <span className={styles.starBadge}>{fmtPrice(starPrice(fish.price))}</span>
                          : '—'}
                      </td>
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

export default FishPage;