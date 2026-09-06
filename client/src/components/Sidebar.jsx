import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Award,
  Bell,
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { id: 'clearance', label: 'Clearance Request', path: '/student/clearance', icon: FileText },
    { id: 'certificate', label: 'Certificate', path: '/student/certificate', icon: Award },
    { id: 'notifications', label: 'Notifications', path: '/student/notifications', icon: Bell },
    { id: 'profile', label: 'Edit Profile', path: '/student/profile', icon: User },
  ];

  const handleNavClick = (item) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    navigate(item.path);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside id="sleek-sidebar" className="w-64 bg-[#0f1f36] text-white flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      <div className="p-5 border-b border-white/10 cursor-pointer" onClick={() => navigate('/student/dashboard')}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm">
            D
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">DigiClear</h1>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Digital Clearance System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Student Portal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path) || activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`dc-focus w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate('/student/profile')}
            data-tooltip="View and edit profile"
            data-tooltip-tone="blue"
            className="tooltip-trigger sidebar-tooltip flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 group transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 font-semibold text-xs shrink-0 group-hover:border-blue-500">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium truncate text-white group-hover:text-blue-400 transition-colors">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.collegeId || user?.studentId || user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            aria-label="Sign Out"
            data-tooltip="Sign out"
            data-tooltip-tone="rose"
            className="tooltip-trigger sidebar-tooltip p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
