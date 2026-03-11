import React from 'react';
// @ts-expect-error - GameFormula.jsx is a JSX file, not TypeScript
import GameFormula from '../Home/GameFormula';
import styles from './tools.module.scss';

const Tools = (): React.ReactElement => {
  return (
    <div className={styles.tools}>
      <div className={styles.header}>
        <h1>Tools & Calculators</h1>
        <p>Professional gaming tools for XP formulas, damage calculations, and more</p>
      </div>
      
      <GameFormula />
    </div>
  );
};

export default Tools;
