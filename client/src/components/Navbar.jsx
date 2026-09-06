import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, LogOut } from 'lucide-react';

export default function Navbar({ 
  title = 'No-Dues Clearance',
  category = 'Academic Services'
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileInitial = user?.name?.trim()?.charAt(0).toUpperCase() || 'S';

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header id="sleek-header" className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span className="hover:text-slate-700 cursor-pointer">{category}</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-medium">{title}</span>
      </div>

      {/* Right User & Status Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/student/profile')}
          aria-label="View Profile"
          data-tooltip="View profile"
          data-tooltip-tone="blue"
          className="tooltip-trigger w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {profileInitial}
        </button>

        <button
          onClick={handleSignOut}
          aria-label="Sign Out"
          data-tooltip="Sign out"
          data-tooltip-tone="rose"
          className="tooltip-trigger text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
