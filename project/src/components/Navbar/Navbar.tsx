import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

export const Navbar = (): JSX.Element => {
  const location = useLocation();
  
  // Don't show navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return <></>;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl text-blue-900">NivaranAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/track-complaint" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/track-complaint' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Track Complaint
            </Link>
            <Link to="/report-issue">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Report Issue
              </Button>
            </Link>
            <Link 
              to="/admin/login" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Authority Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};