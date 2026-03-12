import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottomBar}>
          <div className={styles.socialIcons}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="mailto:contact@example.com">
              <Mail size={18} />
            </a>
          </div>
          <div className={styles.copyright}>
            <p>Heartopia Tracker is a fan-made database. Heartopia and all related assets are trademarks of XD Games.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
