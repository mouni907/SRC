import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Award, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useClearance();

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'approvals') return n.type === 'approval' || n.type === 'certificate';
    if (activeFilter === 'action') return n.type === 'warning';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
              Activity Stream
            </span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Clearance Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates, department sign-offs, and pending action alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'all' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'unread' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setActiveFilter('approvals')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'approvals' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approvals
        </button>

        <button
          onClick={() => setActiveFilter('action')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'action' 
              ? 'bg-blue-600 text-white font-semibold' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Action Required
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No notifications matching this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            const isWarning = notif.type === 'warning';
            const isApproval = notif.type === 'approval' || notif.type === 'certificate';

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex gap-4 transition-colors ${
                  isUnread ? 'bg-blue-50/20 hover:bg-blue-50/40' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm border shadow-2xs ${
                  isWarning ? 'bg-red-50 text-red-600 border-red-200' :
                  isApproval ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {isWarning ? '!' : isApproval ? '✓' : 'i'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="Unread" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{notif.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {notif.department === 'accounts' && (
                      <button
                        onClick={() => navigate('/student/clearance')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>Settle Accounts Dues</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {notif.type === 'certificate' && (
                      <button
                        onClick={() => navigate('/student/certificate')}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <span>Open Certificate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
