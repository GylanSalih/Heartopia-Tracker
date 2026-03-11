import React from 'react';
import styles from './heroSection.module.scss';

interface HeroSectionProps {
  imageUrl?: string;
  onPlayClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl = '/assets/img/SliderLandingImage.png',
  onPlayClick
}) => {
  return (
    <div className={styles.hero}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        <div className={styles.gradient} />
      </div>

      {onPlayClick && (
        <div className={styles.content}>
          <button className={styles.playButton} onClick={onPlayClick}>
            Play Now
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroSection;