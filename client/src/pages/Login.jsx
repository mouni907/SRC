import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    { label: 'Student (Arjun)', email: 'student1@college.edu', pass: 'student123', role: 'Student' },
    { label: 'Library Officer', email: 'library@college.edu', pass: 'dept123', role: 'Department' },
    { label: 'Hostel Warden', email: 'hostel@college.edu', pass: 'dept123', role: 'Department' },
    { label: 'Accounts Officer', email: 'accounts@college.edu', pass: 'dept123', role: 'Department' },
    { label: 'Sports Director', email: 'sports@college.edu', pass: 'dept123', role: 'Department' },
    { label: 'Admin (Dean)', email: 'admin@college.edu', pass: 'admin123', role: 'Admin' },
  ];

  const handleQuickFill = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'department') {
        navigate('/department/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-900 antialiased">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl shadow-xs font-bold text-2xl tracking-tight mb-1">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            DigiClear
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Automated No-Dues &amp; Institutional Clearance System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your institutional credentials or student ID to access clearance workflows.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-email">
                Institutional Email or Student ID
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="text"
                  required
                  placeholder="e.g. student1@college.edu or STU001"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="login-password">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Institutional SSO</span>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-1">
            New to DigiClear? <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">Choose an account type</Link>
          </p>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Quick-Select Demo Accounts
              </span>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleQuickFill(demo)}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 border border-slate-200 rounded-lg transition-all cursor-pointer group"
                >
                  <span className="block text-[11px] font-bold text-slate-800 group-hover:text-blue-700 truncate">
                    {demo.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                    {demo.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional notice footer */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Rajiv Gandhi University of Knowledge Technologies • Portal v1.0</span>
        </div>
      </div>
    </div>
  );
}
