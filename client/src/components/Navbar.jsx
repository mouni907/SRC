import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, LogOut, User } from 'lucide-react';

export default function Navbar({ 
  title = 'No-Dues Clearance',
  category = 'Academic Services'
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider hidden sm:block">
          {user?.semester || 'Semester VIII'}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium text-slate-900 hidden sm:inline">{user?.name || 'Student'}</span>
          <span className="text-[11px] text-slate-400 font-mono">({user?.collegeId || user?.studentId || 'STU001'})</span>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
