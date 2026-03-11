// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DesktopHeader } from './components/Header/DesktopHeader';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './Pages/Home/Home';
import Tools from './Pages/Tools/Tools';
import Roadmap from './Pages/Roadmap/Roadmap';
import styles from './app.module.scss';

import './fonts/fonts.css';
import { DarkModeProvider } from './contexts/DarkModeContext';

const AppContent = (): React.ReactElement => {
  return (
    <div className={styles.app}>
      <Router>
        <ScrollToTop />
        <DesktopHeader />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
        
        <Footer />
      </Router>
    </div>
  );
};

const App = (): React.ReactElement => {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
};

export default App;
