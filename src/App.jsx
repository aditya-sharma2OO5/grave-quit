import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GravequitProvider } from './context/GravequitContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AddItemModal } from './components/AddItemModal';
import { QuitFlowModal } from './components/QuitFlowModal';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { MyItemsPage } from './pages/MyItemsPage';
import { PatternDashboardPage } from './pages/PatternDashboardPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdvisorDashboardPage } from './pages/AdvisorDashboardPage';
import { InternalMetricsPage } from './pages/InternalMetricsPage';
import { ShareableInsightPage } from './pages/ShareableInsightPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';

export function App() {
  return (
    <GravequitProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-body selection:bg-[#A8C5B0] selection:text-[#0A0A0A]">
          
          {/* Shared Header Navigation */}
          <Navbar />

          {/* Main Route Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/items" element={<MyItemsPage />} />
              <Route path="/dashboard" element={<PatternDashboardPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/advisor" element={<AdvisorDashboardPage />} />
              <Route path="/internal-metrics" element={<InternalMetricsPage />} />
              <Route path="/share" element={<ShareableInsightPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </main>

          {/* Global Modals */}
          <AddItemModal />
          <QuitFlowModal />

          {/* Shared Footer */}
          <Footer />

        </div>
      </Router>
    </GravequitProvider>
  );
}

export default App;
