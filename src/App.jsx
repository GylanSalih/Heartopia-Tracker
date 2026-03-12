import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DesktopHeader } from './components/Header/DesktopHeader';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './Pages/Home/Home';
import InsectsPage from './Pages/Wildlife/InsectsPage';
import FishPage from './Pages/Wildlife/FishPage';
import AnimalsPage from './Pages/Wildlife/AnimalsPage';
import BirdsPage from './Pages/Wildlife/BirdsPage';
import CropsPage from './Pages/Wiki/CropsPage';
import NpcsPage from './Pages/Wiki/NpcsPage';
import CollectablesPage from './Pages/Wiki/CollectablesPage';
import AchievementsPage from './Pages/Wiki/AchievementsPage';
import RecipesPage from './Pages/Wiki/RecipesPage';
import IngredientsPage from './Pages/Wiki/IngredientsPage';
import styles from './App.module.scss';
import './fonts/fonts.css';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <DesktopHeader />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wildlife/insects" element={<InsectsPage />} />
          <Route path="/wildlife/fish" element={<FishPage />} />
          <Route path="/wildlife/animals" element={<AnimalsPage />} />
          <Route path="/wildlife/birds" element={<BirdsPage />} />
          <Route path="/wiki/crops" element={<CropsPage />} />
          <Route path="/wiki/npcs" element={<NpcsPage />} />
          <Route path="/wiki/collectables" element={<CollectablesPage />} />
          <Route path="/wiki/achievements" element={<AchievementsPage />} />
          <Route path="/wiki/recipes" element={<RecipesPage />} />
          <Route path="/wiki/ingredients" element={<IngredientsPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
