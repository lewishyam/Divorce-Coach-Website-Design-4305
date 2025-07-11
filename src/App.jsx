import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { BookingProvider } from './context/BookingContext';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Routes>
          </main>
          <Footer />
          <BookingModal />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;