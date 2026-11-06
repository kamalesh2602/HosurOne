import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SuggestModal from './components/common/SuggestModal';

/**
 * ScrollToTop helper ensures window scrolls to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'place',
    categoryHint: '',
  });

  const handleOpenSuggest = (type = 'place', categoryHint = '') => {
    setModalState({
      isOpen: true,
      type,
      categoryHint,
    });
  };

  const handleCloseSuggest = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        {/* Navigation Bar */}
        <Navbar onOpenSuggest={handleOpenSuggest} />

        {/* Page Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home onOpenSuggest={handleOpenSuggest} />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route
              path="/explore"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/transport"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/services"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/community"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/opportunities"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/about"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/contact"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="/privacy"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
            <Route
              path="*"
              element={<PlaceholderPage onOpenSuggest={handleOpenSuggest} />}
            />
          </Routes>
        </div>

        {/* Footer */}
        <Footer onOpenSuggest={handleOpenSuggest} />

        {/* Interactive Community Contribution / Suggestion Modal */}
        <SuggestModal
          isOpen={modalState.isOpen}
          onClose={handleCloseSuggest}
          initialType={modalState.type}
          categoryHint={modalState.categoryHint}
        />
      </div>
    </BrowserRouter>
  );
}
