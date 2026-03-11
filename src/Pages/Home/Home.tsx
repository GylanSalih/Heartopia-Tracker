import React from 'react';
// @ts-expect-error - GameFormula.jsx is a JSX file, not TypeScript
import GameFormula from './GameFormula';
import HeroSection from '../../components/HeroSection/HeroSection';
import FAQ from '../../components/FAQ/FAQ';
import styles from './Home.module.scss';

const Home = (): React.ReactElement => {
  const handlePlayNow = () => {
    // Handle play button click - can navigate to game or show modal
    console.log('Play Now clicked');
  };

  return (
    <div className={styles.home}>
      <HeroSection 
        title="PetalStack RPG"
        subtitle="Embark on an epic adventure in a world of magic and mystery"
        onPlayClick={handlePlayNow}
      />
      <FAQ />
      <GameFormula />
    </div>
  );
};

export default Home;
