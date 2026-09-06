import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Bell,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/department/dashboard', icon: LayoutDashboard },
  { label: 'Clearance Requests', path: '/department/requests', icon: FileText },
  { label: 'My Department', path: '/department/my-department', icon: ShieldCheck },
  { label: 'Reports', path: '/department/reports', icon: Activity }
];

const getDepartmentRoleLabel = (department) => {
  switch (department) {
    case 'hostel':
      return 'Hostel Warden';
    case 'library':
      return 'Chief Librarian';
    case 'accounts':
      return 'Accounts Officer';
    default:
      return 'Sports Director';
  }
};

export default function DepartmentPortalLayout({ children, title = 'Sports Department' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const department = user?.department || 'sports';
  const roleLabel = getDepartmentRoleLabel(department);

  const signOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-slate-900">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#101d33] text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold">D</div>
            <div><p className="text-[17px] font-bold leading-none tracking-tight">DigiClear</p><p className="mt-1 text-[10px] font-medium text-slate-400">Digital Clearance System</p></div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Department Portal</p>
          {navItems.map(({ label, path, icon: Icon }) => (
            <button key={path} type="button" onClick={() => navigate(path)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${(location.pathname === path || (path === '/department/requests' && location.pathname.startsWith('/department/requests/'))) ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Icon className="h-4 w-4 shrink-0" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">{user?.name?.charAt(0) || 'H'}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{user?.name || 'Hostel Officer'}</p><p className="truncate text-[10px] text-slate-400">{roleLabel}</p></div>
            <button type="button" onClick={signOut} aria-label="Log out" className="text-slate-400 hover:text-white"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex min-h-[68px] items-center justify-between border-b border-slate-200 bg-white px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500"><span>Department Portal</span><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-slate-900">{title}</span></div>
          <div className="flex items-center gap-3"><button type="button" onClick={() => navigate('/department/notifications')} aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" /></button><button type="button" onClick={signOut} className="hidden items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 sm:flex"><LogOut className="h-3.5 w-3.5" /> Sign Out</button></div>
        </header>
        <div className="mx-auto w-full max-w-[1280px] space-y-5 p-5 sm:p-7">{children}</div>
      </main>
    </div>
  );
}
