import React, { useState, useMemo } from 'react';
import { FISH, getImgSrc, fmtPrice } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const weatherClass = (w) => {
  if (!w || w === 'Any') return styles.any;
  const l = w.toLowerCase();
  if (l.includes('rainbow')) return styles.rainbow;
  if (l.includes('rain')) return styles.rain;
  if (l.includes('sunny')) return styles.sunny;
  return styles.any;
};

const FishPage = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      FISH.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Fish</h1>
          <p className={styles.pageSubtitle}>{FISH.length} fish species to catch in Heartopia</p>
        </div>

        <input
          type="text"
          placeholder="Search fish…"
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
                <th>Level</th>
                <th>Location</th>
                <th>Weather</th>
                <th>Time</th>
                <th>⭐1 Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fish) => (
                <tr key={fish.name}>
                  <td className={styles.imgCell}>
                    <img
                      src={getImgSrc(fish.name, 'fish')}
                      alt={fish.name}
                      className={styles.itemImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </td>
                  <td>{fish.name}</td>
                  <td>
                    <span className={styles.badge}>Lv {fish.level}</span>
                  </td>
                  <td>{fish.location}</td>
                  <td>
                    <span className={`${styles.weatherBadge} ${weatherClass(fish.weather)}`}>
                      {fish.weather}
                    </span>
                  </td>
                  <td>{fish.time}</td>
                  <td>
                    {fish.price != null ? (
                      <span className={styles.starBadge}>{fmtPrice(fish.price)}</span>
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

export default FishPage;
