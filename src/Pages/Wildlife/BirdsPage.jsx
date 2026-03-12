import React, { useState, useMemo } from 'react';
import { BIRDS, getImgSrc } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const weatherClass = (w) => {
  if (!w || w === 'Any') return styles.any;
  const l = w.toLowerCase();
  if (l.includes('rainbow')) return styles.rainbow;
  if (l.includes('rain')) return styles.rain;
  if (l.includes('sunny')) return styles.sunny;
  return styles.any;
};

const BirdsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      BIRDS.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Birds</h1>
          <p className={styles.pageSubtitle}>{BIRDS.length} bird species to spot in Heartopia</p>
        </div>

        <input
          type="text"
          placeholder="Search birds…"
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((bird) => (
                <tr key={bird.name}>
                  <td className={styles.imgCell}>
                    <img
                      src={getImgSrc(bird.name, 'birds')}
                      alt={bird.name}
                      className={styles.itemImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </td>
                  <td>{bird.name}</td>
                  <td>
                    <span className={styles.badge}>Lv {bird.level}</span>
                  </td>
                  <td>{bird.location}</td>
                  <td>
                    <span className={`${styles.weatherBadge} ${weatherClass(bird.weather)}`}>
                      {bird.weather}
                    </span>
                  </td>
                  <td>{bird.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BirdsPage;
