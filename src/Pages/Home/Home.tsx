import React from 'react';
// @ts-expect-error - xp-formel-v5.jsx is a JSX file, not TypeScript
import XPFormula from './xp-formel-v5';
import styles from './home.module.scss';

const Home = (): React.ReactElement => {
  return (
    <div className={styles.home}>
      <XPFormula />
    </div>
  );
};

export default Home;
