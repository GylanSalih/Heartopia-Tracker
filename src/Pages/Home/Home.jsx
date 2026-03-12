import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import styles from './Home.module.scss';

const Home = () => {
  const handlePlayNow = () => {
    console.log('Play Now clicked');
  };

  return (
    <div className={styles.home}>
      <HeroSection
        title="Lost Dreams of Tomorrow"
        subtitle="Embark on an epic adventure in a world of magic and mystery"
        onPlayClick={handlePlayNow}
      />
    </div>
  );
};

export default Home;
