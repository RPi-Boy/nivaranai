import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage/ReportIssuePage';
import { TrackComplaintPage } from './pages/TrackComplaintPage/TrackComplaintPage';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin/AdminLogin';
import { Navbar } from './components/Navbar/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report-issue" element={<ReportIssuePage />} />
          <Route path="/track-complaint" element={<TrackComplaintPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;