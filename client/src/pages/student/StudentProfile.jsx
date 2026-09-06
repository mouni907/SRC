import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Home, 
  CheckCircle2, 
  FileText, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function StudentProfile() {
  const navigate = useNavigate();
  const { student, updateStudentProfile } = useClearance();

  const [formData, setFormData] = useState({
    name: student.name || '',
    collegeId: student.collegeId || '',
    hallTicket: student.hallTicket || '',
    email: student.email || '',
    phone: student.phone || '+91 98765 43210',
    department: student.department || '',
    degree: student.degree || '',
    semester: student.semester || 'Semester VIII',
    batch: student.batch || '2022 - 2026',
    roomNo: student.roomNo || 'Hostel Block B - Room 314',
    cgpa: student.cgpa || '8.84'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a valid full name.');
      return;
    }
    if (!formData.collegeId.trim()) {
      setError('Please provide your university roll or college ID.');
      return;
    }

    updateStudentProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleReset = () => {
    setFormData({
      name: student.name || '',
      collegeId: student.collegeId || '',
      hallTicket: student.hallTicket || '',
      email: student.email || '',
      phone: student.phone || '+91 98765 43210',
      department: student.department || '',
      degree: student.degree || '',
      semester: student.semester || 'Semester VIII',
      batch: student.batch || '2022 - 2026',
      roomNo: student.roomNo || 'Hostel Block B - Room 314',
      cgpa: student.cgpa || '8.84'
    });
    setSavedSuccess(false);
    setError('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            {formData.name.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Student Academic Profile</h1>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit your credentials and contact information synchronized with your No-Dues Clearance record.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/student/dashboard')}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 shadow-xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Profile updated successfully! All academic credentials, clearance records, and certificate previews are synchronized.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2.5 shadow-xs transition-all">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            Personal &amp; Contact Information
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Official identity as registered in the University Student Information System (SIS).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-name">
                Full Name (Institutional Records) *
              </label>
              <div className="relative">
                <input
                  id="field-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-email">
                Institutional Email Address *
              </label>
              <div className="relative">
                <input
                  id="field-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-phone">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-room">
                Hostel Block &amp; Room Assignment
              </label>
              <div className="relative">
                <input
                  id="field-room"
                  type="text"
                  name="roomNo"
                  value={formData.roomNo}
                  onChange={handleChange}
                  placeholder="e.g. Hostel Block B - Room 314"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
                <Home className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            Academic &amp; Departmental Credentials
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Details embedded onto your official No-Dues Clearance Certificate and verification QR code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-collegeId">
                University Roll / College ID *
              </label>
              <input
                id="field-collegeId"
                type="text"
                name="collegeId"
                required
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-hallTicket">
                Examination Hall Ticket Number
              </label>
              <input
                id="field-hallTicket"
                type="text"
                name="hallTicket"
                value={formData.hallTicket}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-batch">
                Academic Batch
              </label>
              <input
                id="field-batch"
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="2022 - 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-department">
                Department / Academic Discipline *
              </label>
              <input
                id="field-department"
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-degree">
                Degree Program
              </label>
              <input
                id="field-degree"
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-semester">
                Current Semester
              </label>
              <input
                id="field-semester"
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="field-cgpa">
                Cumulative GPA (CGPA)
              </label>
              <input
                id="field-cgpa"
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Updates are instantly synchronized across certificate &amp; institutional records.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
