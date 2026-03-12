import React from 'react';
import { ANIMALS, getImgSrc } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const AnimalsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Animals</h1>
          <p className={styles.pageSubtitle}>{ANIMALS.length} animals you can raise or befriend in Heartopia</p>
        </div>

        <div className={styles.grid}>
          {ANIMALS.map((animal) => (
            <div key={animal.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(animal.name, 'animals')}
                  alt={animal.name}
                  className={styles.cardImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
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
