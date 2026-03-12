import React from 'react';
import { INGREDIENTS, getImgSrc } from '../Tracker/data/trackerData';
import styles from '../wiki.module.scss';

const IngredientsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Ingredients</h1>
          <p className={styles.pageSubtitle}>{INGREDIENTS.length} cooking ingredients in Heartopia</p>
        </div>

        <div className={styles.list}>
          {INGREDIENTS.map((item) => (
            <div key={item.name} className={styles.listItem}>
              <img
                src={getImgSrc(item.name, 'ingredients')}
                alt={item.name}
                className={styles.itemImg}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;
