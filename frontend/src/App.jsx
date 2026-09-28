import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';
import ApplyPage from './pages/ApplyPage';
import TrackPage from './pages/TrackPage';
import AdminDashboard from './pages/AdminDashboard';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [selectedCollegeForApply, setSelectedCollegeForApply] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab =
    location.pathname === '/colleges'
      ? 'colleges'
      : location.pathname === '/apply'
        ? 'apply'
        : location.pathname === '/track'
          ? 'track'
          : location.pathname === '/admin'
            ? 'admin'
            : 'home';

  const setActiveTab = (tab) => {
    const routes = {
      home: '/',
      colleges: '/colleges',
      apply: '/apply',
      track: '/track',
      admin: '/admin',
    };

    navigate(routes[tab] || '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setActiveTab={setActiveTab}
                setSelectedCollegeForApply={setSelectedCollegeForApply}
              />
            }
          />

          <Route
            path="/colleges"
            element={
              <CollegesPage
                setActiveTab={setActiveTab}
                setSelectedCollegeForApply={setSelectedCollegeForApply}
              />
            }
          />

          <Route
            path="/apply"
            element={
              <ApplyPage
                selectedCollegeForApply={selectedCollegeForApply}
                setSelectedCollegeForApply={setSelectedCollegeForApply}
                setActiveTab={setActiveTab}
              />
            }
          />

          <Route path="/track" element={<TrackPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>

            <span className="font-bold text-slate-800 text-sm">
              UniAdmit Portal
            </span>

            <span>
              &bull; Full-Stack Django & React College Admissions System
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('colleges')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Colleges & Cutoffs
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Apply Online
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Track Status
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}