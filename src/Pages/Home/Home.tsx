import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import FAQ from '../../components/FAQ/FAQ';
import styles from './Home.module.scss';

const Home = (): React.ReactElement => {
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
      <FAQ />
    </div>
  );
};

export default Home;
