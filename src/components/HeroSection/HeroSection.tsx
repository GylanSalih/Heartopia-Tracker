import React from 'react';
import styles from './heroSection.module.scss';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  onPlayClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'PetalStack RPG',
  subtitle = 'Embark on an epic adventure in a world of magic and mystery',
  imageUrl = '/assets/img/SliderLandingImage.png',
  onPlayClick
}) => {
  return (
    <div className={styles.hero}>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url('${imageUrl}')`
        }}
      >
        <div className={styles.gradient} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        {onPlayClick && (
          <button className={styles.playButton} onClick={onPlayClick}>
            <span>Play Now</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 10L8.5 5.5V14.5L16.5 10Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
