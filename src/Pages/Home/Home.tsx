import React from 'react';
// @ts-expect-error - GameFormula.jsx is a JSX file, not TypeScript
import GameFormula from './GameFormula';
import styles from './Home.module.scss';

const Home = (): React.ReactElement => {
  return (
    <div className={styles.home}>
      <GameFormula />
    </div>
  );
};

export default Home;
