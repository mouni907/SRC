import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronRight, LogOut } from 'lucide-react';

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
    <header id="sleek-header" className="h-16 bg-white border-b border-slate-200 px-5 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span className="hover:text-slate-700 cursor-pointer">{category}</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-medium">{title}</span>
      </div>

      {/* Right User & Status Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 sm:inline">Spring 2026</span>
        <button
          onClick={() => navigate('/student/notifications')}
          aria-label="View notifications"
          data-tooltip="Notifications"
          className="tooltip-trigger dc-focus relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <button
          onClick={() => navigate('/student/profile')}
          aria-label="View Profile"
          data-tooltip="View profile"
          data-tooltip-tone="blue"
          className="tooltip-trigger dc-focus w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {profileInitial}
        </button>

        <button
          onClick={handleSignOut}
          aria-label="Sign Out"
          data-tooltip="Sign out"
          data-tooltip-tone="rose"
          className="tooltip-trigger dc-focus text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
