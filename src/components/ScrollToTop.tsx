// ScrollToTop.tsx
// instant scroll to top

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ultra aggressive instant scroll
    const scrollToTop = () => {
      // Disable any smooth scrolling
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      // Force scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Double check
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    };
    
    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
