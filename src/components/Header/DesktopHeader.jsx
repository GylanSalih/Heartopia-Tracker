import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Save, Download, Upload, Moon, Sun } from 'lucide-react';
import { useTrackerState } from '../../hooks/useTrackerState';
import { TOTALS } from '../../Pages/Tracker/data/trackerData';
import { useDarkMode } from '../../contexts/DarkModeContext';
import styles from './DesktopHeader.module.scss';

const WILDLIFE_LINKS = [
  { to: '/wildlife/insects', label: 'Insects', key: 'insects', img: '/assets/img/insects/Cicada.avif', checkable: true },
  { to: '/wildlife/fish', label: 'Fish', key: 'fish', img: '/assets/img/fish/Goldfish.avif', checkable: true },
  { to: '/wildlife/animals', label: 'Animals', key: 'animals', img: '/assets/img/animals/bunny.avif', checkable: false },
  { to: '/wildlife/birds', label: 'Birds', key: 'birds', img: '/assets/img/birds/Mallard.avif', checkable: true },
];

const WIKI_LINKS = [
  { to: '/wiki/crops', label: 'Crops', key: 'crops', img: '/assets/img/Crops/grape.avif', checkable: true },
  { to: '/wiki/npcs', label: 'NPCs', key: 'npcs', img: '/assets/img/npcs/naniwa.webp', checkable: false },
  { to: '/wiki/collectables', label: 'Collectables', key: 'collectables', img: '/assets/img/collectables/Quality Timber.avif', checkable: true },
  { to: '/wiki/achievements', label: 'Achievements', key: 'achievements', img: '/assets/img/achievements/Meow-Meow Canteen.avif', checkable: true },
  { to: '/wiki/recipes', label: 'Recipes', key: 'recipes', img: '/assets/img/recipes/Tiramisu.avif', checkable: true },
  { to: '/wiki/ingredients', label: 'Ingredients', key: 'ingredients', img: '/assets/img/ingredients/Cheese.avif', checkable: true },
];

const DesktopHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Get all tracker states
  const [insectsChecked] = useTrackerState('insects');
  const [fishChecked] = useTrackerState('fish');
  const [birdsChecked] = useTrackerState('birds');
  const [cropsChecked] = useTrackerState('crops');
  const [collectablesChecked] = useTrackerState('collectables');
  const [achievementsChecked] = useTrackerState('achievements');
  const [recipesChecked] = useTrackerState('recipes');
  const [ingredientsChecked] = useTrackerState('ingredients');

  const trackerCounts = {
    insects: insectsChecked.size,
    fish: fishChecked.size,
    birds: birdsChecked.size,
    crops: cropsChecked.size,
    collectables: collectablesChecked.size,
    achievements: achievementsChecked.size,
    recipes: recipesChecked.size,
    ingredients: ingredientsChecked.size,
  };

  const getCounterLabel = (link) => {
    if (!link.checkable) {
      return TOTALS[link.key] || 0;
    }
    const checked = trackerCounts[link.key] || 0;
    const total = TOTALS[link.key] || 0;
    return `${checked}/${total}`;
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenSection(null);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (links) => links.some((l) => location.pathname === l.to);

  const handleExportJSON = () => {
    const trackerData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tracker:')) {
        trackerData[key] = localStorage.getItem(key);
      }
    }
    const dataStr = JSON.stringify(trackerData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heartopia-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result);
          Object.keys(data).forEach((key) => {
            if (key.startsWith('tracker:')) {
              localStorage.setItem(key, data[key]);
            }
          });
          alert('Data successfully imported! Please refresh the page to see the changes.');
          window.location.reload();
        } catch (err) {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span>Heartopia Tracker</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {WILDLIFE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.navLink} ${isActive(l.to) ? styles.active : ''}`}
            >
              <img src={l.img} alt={l.label} className={styles.navIcon} loading="eager" onError={(e) => e.target.style.display = 'none'} />
              <span>{l.label}</span>
              <span className={styles.navCounter}>{getCounterLabel(l)}</span>
            </Link>
          ))}

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
                  <img src={l.img} alt={l.label} className={styles.menuIcon} loading="eager" onError={(e) => e.target.style.display = 'none'} />
                  <span>{l.label}</span>
                  <span className={styles.menuCounter}>{getCounterLabel(l)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.dropdown}>
            <button
              className={`${styles.navLink} ${styles.dropdownToggle}`}
            >
              <Save size={15} /> <ChevronDown size={13} className={styles.chevron} />
            </button>
            <div className={styles.dropdownMenu}>
              <button
                onClick={handleExportJSON}
                className={styles.dropdownItem}
              >
                <Download size={14} /> Export JSON
              </button>
              <button
                onClick={handleImportJSON}
                className={styles.dropdownItem}
              >
                <Upload size={14} /> Import JSON
              </button>
            </div>
          </div>

          <button
            className={styles.themeToggle}
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Popup */}
      {isMenuOpen && (
        <>
          <div 
            className={styles.mobileMenuOverlay} 
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.mobileNav}>
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Menu</span>
              <button
                className={styles.mobileClose}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.mobileLinks}>
              {WILDLIFE_LINKS.map((l) => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  className={`${styles.mobileLink} ${isActive(l.to) ? styles.active : ''}`}
                >
                  <img src={l.img} alt={l.label} className={styles.mobileIcon} loading="eager" onError={(e) => e.target.style.display = 'none'} />
                  <span>{l.label}</span>
                  <span className={styles.mobileCounter}>{getCounterLabel(l)}</span>
                </Link>
              ))}

              <div className={styles.mobileGroup}>
                <button
                  className={styles.mobileGroupTitle}
                  onClick={() => setOpenSection(openSection === 'wiki' ? null : 'wiki')}
                >
                  <span>Wiki</span>
                  <ChevronDown size={16} className={openSection === 'wiki' ? styles.rotated : ''} />
                </button>
                {openSection === 'wiki' && (
                  <div className={styles.mobileGroupLinks}>
                    {WIKI_LINKS.map((l) => (
                      <Link 
                        key={l.to} 
                        to={l.to} 
                        className={`${styles.mobileSubLink} ${isActive(l.to) ? styles.active : ''}`}
                      >
                        <img src={l.img} alt={l.label} className={styles.mobileIcon} loading="eager" onError={(e) => e.target.style.display = 'none'} />
                        <span>{l.label}</span>
                        <span className={styles.mobileCounter}>{getCounterLabel(l)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.mobileActions}>
              <div className={styles.mobileActionGroup}>
                <button
                  onClick={handleExportJSON}
                  className={styles.mobileActionButton}
                >
                  <Download size={18} />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleImportJSON}
                  className={styles.mobileActionButton}
                >
                  <Upload size={18} />
                  <span>Import JSON</span>
                </button>
              </div>

              <button
                className={styles.mobileThemeToggle}
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={18} />
                    <span style={{ marginLeft: '0.5rem' }}>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span style={{ marginLeft: '0.5rem' }}>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export { DesktopHeader };