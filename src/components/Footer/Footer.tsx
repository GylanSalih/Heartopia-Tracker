import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './footer.module.scss';

const Footer = (): React.ReactElement => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottomBar}>

          {/* Social Icons */}
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

          {/* Copyright */}
          <div className={styles.copyright}>
            <p>
              Copyright © Lost Dreams of Tomorrow All Rights Reserved
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;