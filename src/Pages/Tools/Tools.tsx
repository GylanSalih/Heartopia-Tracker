import React from 'react';
// @ts-expect-error - GameFormula.jsx is a JSX file, not TypeScript
import GameFormula from '../Home/GameFormula';
import styles from './tools.module.scss';

const Tools = (): React.ReactElement => {
  return (
    <div className={styles.tools}>
      <GameFormula />
    </div>
  );
};

export default Tools;
