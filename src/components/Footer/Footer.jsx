import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>Heartopia Tracker is a fan-made database. Heartopia and all related assets are trademarks of XD Games.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
