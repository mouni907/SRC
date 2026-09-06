import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  UserRound,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const departments = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Mechanical Engineering'
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    studentId: '',
    department: departments[0],
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        studentId: form.studentId,
        department: form.department,
        password: form.password
      });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-900 antialiased">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl shadow-xs font-bold text-2xl tracking-tight mb-1">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">DigiClear</h1>
          <p className="text-xs text-slate-500 font-medium">Your digital path to a clear graduation</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">Student access</p>
            <h2 className="text-base font-bold text-slate-900">Create your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Use your institutional details to start your clearance journey.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="signup-name">Full name</label>
              <div className="relative">
                <input id="signup-name" type="text" required autoComplete="name" placeholder="e.g. Arjun Sharma" value={form.name} onChange={updateField('name')} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                <UserRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="signup-email">Institutional email</label>
                <div className="relative">
                  <input id="signup-email" type="email" required autoComplete="email" placeholder="you@college.edu" value={form.email} onChange={updateField('email')} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="signup-student-id">Student ID</label>
                <div className="relative">
                  <input id="signup-student-id" type="text" required placeholder="e.g. STU003" value={form.studentId} onChange={updateField('studentId')} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="signup-department">Department</label>
              <select id="signup-department" value={form.department} onChange={updateField('department')} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[['password', 'Password', showPassword, setShowPassword], ['confirmPassword', 'Confirm password', showConfirmPassword, setShowConfirmPassword]].map(([field, label, visible, setVisible]) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor={`signup-${field}`}>{label}</label>
                  <div className="relative">
                    <input id={`signup-${field}`} type={visible ? 'text' : 'password'} required minLength="8" autoComplete="new-password" placeholder="At least 8 characters" value={form[field]} onChange={updateField(field)} className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Your account will be created with student access and signed in automatically.</span>
            </div>

            <button id="signup-submit-btn" type="submit" disabled={isSubmitting} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed">
              <span>{isSubmitting ? 'Creating account...' : 'Create student account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-1">
            Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400">Rajiv Gandhi University of Knowledge Technologies • Portal v1.0</p>
      </div>
    </div>
  );
}
