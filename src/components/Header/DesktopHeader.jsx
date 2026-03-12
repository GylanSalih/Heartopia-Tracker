import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from './DesktopHeader.module.scss';

const WILDLIFE_LINKS = [
  { to: '/wildlife/insects', label: 'Insects' },
  { to: '/wildlife/fish', label: 'Fish' },
  { to: '/wildlife/animals', label: 'Animals' },
  { to: '/wildlife/birds', label: 'Birds' },
];

const WIKI_LINKS = [
  { to: '/wiki/crops', label: 'Crops' },
  { to: '/wiki/npcs', label: 'NPCs' },
  { to: '/wiki/collectables', label: 'Collectables' },
  { to: '/wiki/achievements', label: 'Achievements' },
  { to: '/wiki/recipes', label: 'Recipes' },
  { to: '/wiki/ingredients', label: 'Ingredients' },
];

const DesktopHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenSection(null);
  }, [location]);

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (links) => links.some((l) => location.pathname === l.to);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src="/assets/img/Logo_White.png" alt="Heartopia" width={38} height={38} />
          <span>Heartopia</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
            Home
          </Link>

          <div className={styles.dropdown}>
            <button
              className={`${styles.navLink} ${styles.dropdownToggle} ${isGroupActive(WILDLIFE_LINKS) ? styles.active : ''}`}
            >
              Wild Life <ChevronDown size={13} className={styles.chevron} />
            </button>
            <div className={styles.dropdownMenu}>
              {WILDLIFE_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${styles.dropdownItem} ${isActive(l.to) ? styles.activeItem : ''}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.dropdown}>
            <button
              className={`${styles.navLink} ${styles.dropdownToggle} ${isGroupActive(WIKI_LINKS) ? styles.active : ''}`}
            >
              Wiki <ChevronDown size={13} className={styles.chevron} />
            </button>
            <div className={styles.dropdownMenu}>
              {WIKI_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${styles.dropdownItem} ${isActive(l.to) ? styles.activeItem : ''}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {isMenuOpen && (
          <div className={styles.mobileNav}>
            <button
              className={styles.mobileClose}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <div className={styles.mobileLinks}>
              <Link to="/" className={`${styles.mobileLink} ${isActive('/') ? styles.active : ''}`}>
                Home
              </Link>

              <div className={styles.mobileGroup}>
                <button
                  className={styles.mobileGroupTitle}
                  onClick={() => setOpenSection(openSection === 'wildlife' ? null : 'wildlife')}
                >
                  Wild Life <ChevronDown size={14} className={openSection === 'wildlife' ? styles.rotated : ''} />
                </button>
                {openSection === 'wildlife' && (
                  <div className={styles.mobileGroupLinks}>
                    {WILDLIFE_LINKS.map((l) => (
                      <Link key={l.to} to={l.to} className={styles.mobileSubLink}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.mobileGroup}>
                <button
                  className={styles.mobileGroupTitle}
                  onClick={() => setOpenSection(openSection === 'wiki' ? null : 'wiki')}
                >
                  Wiki <ChevronDown size={14} className={openSection === 'wiki' ? styles.rotated : ''} />
                </button>
                {openSection === 'wiki' && (
                  <div className={styles.mobileGroupLinks}>
                    {WIKI_LINKS.map((l) => (
                      <Link key={l.to} to={l.to} className={styles.mobileSubLink}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { DesktopHeader };