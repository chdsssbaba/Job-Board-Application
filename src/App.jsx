import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import JobListings from './pages/JobListings';
import Tracker from './pages/Tracker';
import { Briefcase, Bookmark } from 'lucide-react';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative">
      <header className="glass-strong sticky top-0 z-50 border-b border-purple-400/20 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-100 drop-shadow-lg glow">
            <div className="p-2 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
              <Briefcase className="w-6 h-6 text-purple-300" />
            </div>
            <span className="bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
              JobFinder
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${location.pathname === '/'
                  ? 'glass-button-active text-white shadow-lg'
                  : 'glass-button text-indigo-100 hover:text-white'
                }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/tracker"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${location.pathname === '/tracker'
                  ? 'glass-button-active text-white shadow-lg'
                  : 'glass-button text-indigo-100 hover:text-white'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              Tracker
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<JobListings />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
