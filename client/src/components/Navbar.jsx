import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { Bell, ChevronRight, LogOut } from 'lucide-react';
=======
import { Bell, CheckCircle2, ChevronRight, FileText, LogOut, XCircle, Award } from 'lucide-react';
import { useClearance } from '../context/ClearanceContext';
>>>>>>> 0d27172 (final touch)

export default function Navbar({ 
  title = 'No-Dues Clearance',
  category = 'Academic Services'
}) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useClearance();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileInitial = user?.name?.trim()?.charAt(0).toUpperCase() || 'S';

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const openNotification = (notification) => {
    markNotificationAsRead(notification.id);
    setIsOpen(false);
    navigate(notification.type === 'certificate_ready' ? '/student/certificate' : '/student/clearance');
  };

  const iconFor = (type) => {
    if (type === 'department_approved') return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (type === 'department_rejected') return <XCircle className="w-4 h-4 text-rose-600" />;
    if (type === 'certificate_ready') return <Award className="w-4 h-4 text-amber-600" />;
    return <FileText className="w-4 h-4 text-blue-600" />;
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
<<<<<<< HEAD
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
=======
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={isOpen}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </button>
          {isOpen && (
            <div className="absolute right-0 top-11 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">Notifications</p>
                {unreadCount > 0 && <button type="button" onClick={markAllNotificationsAsRead} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">Mark all</button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <button type="button" key={notification.id} onClick={() => openNotification(notification)} className={`w-full flex gap-3 p-3 text-left border-b border-slate-50 hover:bg-slate-50 ${notification.read ? 'opacity-65' : 'bg-blue-50/40'}`}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">{iconFor(notification.type)}</span>
                    <span className="min-w-0"><span className="block text-xs font-semibold text-slate-800 truncate">{notification.title}</span><span className="mt-0.5 block text-[11px] leading-4 text-slate-500 line-clamp-2">{notification.message}</span><span className="mt-1 block text-[10px] text-slate-400">{formatRelativeTime(notification.createdAt)}</span></span>
                  </button>
                ))}
                {notifications.length === 0 && <div className="p-7 text-center text-xs text-slate-500"><Bell className="mx-auto mb-2 h-5 w-5 text-slate-300" />You&apos;re all caught up!</div>}
              </div>
              <button type="button" onClick={() => { setIsOpen(false); navigate('/student/notifications'); }} className="w-full border-t border-slate-100 px-4 py-3 text-xs font-semibold text-blue-600 hover:bg-slate-50">View all notifications</button>
            </div>
          )}
        </div>
>>>>>>> 0d27172 (final touch)
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

function formatRelativeTime(value) {
  if (!value) return 'Just now';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day ago`;
}
