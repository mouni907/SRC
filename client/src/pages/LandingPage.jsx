import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Home,
  Trophy,
  CreditCard,
  ShieldCheck,
  Bell,
  FileCheck,
  Users,
  Lock,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Download
} from 'lucide-react';

export default function ClearCampusLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-200">
              <ShieldCheck size={22} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-teal-700 tracking-tight">
              ClearCampus
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#departments" className="hover:text-teal-600 transition-colors">Departments</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#roles" className="hover:text-teal-600 transition-colors">Access Roles</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all">
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <a href="#how-it-works" className="block text-slate-600 py-1" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#departments" className="block text-slate-600 py-1" onClick={() => setMobileMenuOpen(false)}>Departments</a>
            <a href="#features" className="block text-slate-600 py-1" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#roles" className="block text-slate-600 py-1" onClick={() => setMobileMenuOpen(false)}>Access Roles</a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full py-2 text-slate-700 font-semibold border border-slate-200 rounded-lg" type="button">Login</button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }} className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg" type="button">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Digital Campus Governance Platform
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Your Campus Clearance, <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600">Finally Digital.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Raise one clearance request, get approvals from every department, and receive your digitally verified No-Dues Certificate — without standing in physical queues.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button onClick={() => navigate('/student/clearance')} className="w-full sm:w-auto px-6 py-3.5 text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 font-medium rounded-xl shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2" type="button">
                  Start Clearance <ArrowRight size={18} />
                </button>
                <button className="w-full sm:w-auto px-6 py-3.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-medium rounded-xl transition-all" type="button">
                  Explore How It Works
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clearance Status</span>
                    <h3 className="text-base font-bold text-slate-800">Alex Johnson</h3>
                    <p className="text-xs text-slate-500">ID: STU2026001</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                    <Clock size={12} /> In Progress
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <StatusRow icon={<BookOpen size={16} />} title="Library" status="approved" />
                  <StatusRow icon={<Home size={16} />} title="Hostels" status="approved" />
                  <StatusRow icon={<Trophy size={16} />} title="Sports" status="pending" />
                  <StatusRow icon={<CreditCard size={16} />} title="Accounts" status="pending" />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Overall Clearance Progress</span>
                    <span className="text-teal-600">50%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full w-[50%] rounded-full transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature stat cards removed as requested */}

      <section id="how-it-works" className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Clear your dues in 4 simple steps</h2>
            <p className="text-slate-600 mt-2">Ditch physical signatures for an automated digital workflow.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <StepCard number="01" title="Login" desc="Student logs in using their unique student ID and portal credentials." />
            <StepCard number="02" title="Raise Request" desc="Submit one consolidated digital clearance request with a single click." />
            <StepCard number="03" title="Department Approval" desc="Library, Hostels, Sports, and Accounts verify dues & approve digitally." />
            <StepCard number="04" title="Get Certificate" desc="Once fully approved, the tamper-proof No-Dues Certificate is auto-generated." />
          </div>
        </div>
      </section>

      <section id="departments" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">One request. Every department.</h2>
            <p className="text-slate-600 mt-2">Seamless integration across key college administrative hubs.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DeptCard icon={<BookOpen className="text-blue-600" />} name="Library" desc="Books, fines, and library resource verifications." />
            <DeptCard icon={<Home className="text-indigo-600" />} name="Hostels" desc="Hostel dues, room inventory, and damage clearances." />
            <DeptCard icon={<Trophy className="text-amber-600" />} name="Sports" desc="Sports equipment returns and pending club dues." />
            <DeptCard icon={<CreditCard className="text-emerald-600" />} name="Accounts" desc="Tuition fees, fines, and overall financial clearance." />
          </div>
        </div>
      </section>

      <section id="features" className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Everything happens digitally.</h2>
            <p className="text-slate-400 mt-2">Designed for fast campus administration and reliable verification.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard icon={<Lock />} title="Secure Student Login" desc="Protected SSO access tailored specifically to student databases." />
            <FeatureCard icon={<Clock />} title="Real-Time Tracking" desc="Monitor department approval status in live time anytime, anywhere." />
            <FeatureCard icon={<ShieldCheck />} title="Digital Verification" desc="Cryptographically secured approvals eliminate fraudulent slips." />
            <FeatureCard icon={<Users />} title="Role-Based Access" desc="Separate intuitive workflows for students, staff, and campus admins." />
            <FeatureCard icon={<FileCheck />} title="Automatic Certificate" desc="Instant PDF download generated upon 100% complete department sign-off." />
            <FeatureCard icon={<Bell />} title="Instant Notifications" desc="Get alerted over email & portal whenever a department updates status." />
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Verification System</span>
              <h2 className="text-3xl font-bold text-slate-900">Digitally Verified &amp; Tamper-Proof Certificates</h2>
              <p className="text-slate-600 leading-relaxed">
                No more paper certificates that can be misplaced. Once all four departments clear your records, a verified document is locked and issued with a unique Certificate ID.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border-2 border-indigo-100 p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

                <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Official Document</p>
                    <h3 className="text-xl font-bold text-slate-900">DIGITAL NO-DUES CERTIFICATE</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <p>This is to certify that</p>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Alex Johnson</h4>
                    <p className="text-xs text-slate-500">Student ID: STU2026001</p>
                  </div>
                  <p>has successfully cleared all institutional dues across required departments:</p>

                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 p-2 rounded">
                      <CheckCircle2 size={14} /> Library Cleared
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 p-2 rounded">
                      <CheckCircle2 size={14} /> Hostels Cleared
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 p-2 rounded">
                      <CheckCircle2 size={14} /> Sports Cleared
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 p-2 rounded">
                      <CheckCircle2 size={14} /> Accounts Cleared
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Certificate ID</p>
                      <p className="text-xs font-mono font-bold text-slate-700">NDC-2026-1042</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all" type="button">
                      <Download size={14} /> Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tailored for everyone on campus</h2>
            <p className="text-slate-600 mt-2">Customized portals built specifically for each administrative role.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              role="Student"
              points={['Raise clearance request', 'Track status in real-time', 'Download digital certificate']}
            />
            <RoleCard
              role="Department Staff"
              points={['View incoming department requests', 'Approve or reject dues with remarks', 'Digitally verify clearance status']}
            />
            <RoleCard
              role="Admin"
              points={['Manage department workflows', 'Manage users & permissions', 'Monitor campus-wide clearance analytics']}
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-teal-50 via-white to-indigo-50 text-slate-800 border-y border-teal-100">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Ready to leave the paperwork behind?</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Complete your campus clearance faster, smarter, and completely online today.
          </p>
          <div className="pt-4">
            <button onClick={() => navigate('/student/clearance')} className="px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white hover:from-teal-600 hover:to-indigo-700 font-bold rounded-xl shadow-lg shadow-teal-100 transition-all inline-flex items-center gap-2" type="button">
              Start Your Clearance <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function StatusRow({ icon, title, status }) {
  const isApproved = status === 'approved';
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-2.5 text-slate-700 text-xs font-semibold">
        <span className="text-slate-500">{icon}</span>
        {title}
      </div>
      {isApproved ? (
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
          <CheckCircle2 size={12} /> Approved
        </span>
      ) : (
        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
          <Clock size={12} /> Pending
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
      <div className="text-lg sm:text-xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 relative">
      <span className="text-2xl font-black text-teal-600/30 font-mono">{number}</span>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function DeptCard({ icon, name, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-lg transition-all space-y-3 group">
      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-800">{name}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
      <div className="text-teal-400">{icon}</div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function RoleCard({ role, points }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
      <h3 className="text-lg font-bold text-teal-600">{role}</h3>
      <ul className="space-y-2">
        {points.map((pt, i) => (
          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
            <CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}
