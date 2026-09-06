import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Bell, Check, CheckCircle2, FileText, XCircle } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';

const filters = [['all', 'All'], ['unread', 'Unread'], ['status', 'Status changes'], ['certificate', 'Certificates']];

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useClearance();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'status') return notification.type.startsWith('department_') || notification.type === 'clearance_completed';
    if (activeFilter === 'certificate') return notification.type === 'certificate_ready';
    return true;
  });

  const openNotification = (notification) => {
    markNotificationAsRead(notification.id);
    navigate(notification.type === 'certificate_ready' ? '/student/certificate' : '/student/clearance');
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Bell className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">Activity center</p><h2 className="mt-1 text-xl font-bold text-slate-900">Notifications</h2><p className="mt-1 text-xs text-slate-500">Stay updated with your No-Dues clearance activity.</p></div></div>
        {unreadCount > 0 && <button type="button" onClick={markAllNotificationsAsRead} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"><Check className="h-3.5 w-3.5" /> Mark all as read</button>}
      </section>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">{filters.map(([value, label]) => <button key={value} type="button" onClick={() => setActiveFilter(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilter === value ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{label}{value === 'unread' ? ` (${unreadCount})` : ''}</button>)}</div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {filteredNotifications.length === 0 ? <div className="p-14 text-center text-slate-500"><Bell className="mx-auto mb-3 h-8 w-8 text-slate-300" /><p className="text-sm font-semibold text-slate-700">You&apos;re all caught up</p><p className="mt-1 text-xs">No new clearance updates at the moment.</p></div> : filteredNotifications.map((notification) => <NotificationRow key={notification.id} notification={notification} onOpen={() => openNotification(notification)} onRead={() => markNotificationAsRead(notification.id)} />)}
      </section>
    </div>
  );
}

function NotificationRow({ notification, onOpen, onRead }) {
  const icon = notification.type === 'department_approved' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : notification.type === 'department_rejected' ? <XCircle className="h-4 w-4 text-rose-600" /> : notification.type === 'certificate_ready' ? <Award className="h-4 w-4 text-amber-600" /> : <FileText className="h-4 w-4 text-blue-600" />;
  return <div className={`flex gap-3 border-b border-slate-100 p-4 sm:p-5 ${notification.read ? '' : 'bg-blue-50/35'}`}><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">{icon}</div><button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className={`text-sm ${notification.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{notification.title}</p><span className="text-[10px] text-slate-400">{formatRelativeTime(notification.createdAt)}</span></div><p className="mt-1 text-xs leading-relaxed text-slate-600">{notification.message}</p>{notification.department && <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{notification.department}</p>}</button>{!notification.read && <button type="button" onClick={onRead} className="self-center text-[10px] font-semibold text-slate-400 hover:text-blue-600">Read</button>}</div>;
}

function formatRelativeTime(value) {
  if (!value) return 'Just now';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day ago`;
}
