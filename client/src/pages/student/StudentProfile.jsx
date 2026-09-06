

import React, { useState } from 'react';
import { useClearance } from '../../context/ClearanceContext';
import {
  Check,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  RotateCcw,
  Save,
  User,
  UserRound
} from 'lucide-react';

const getFormData = (student) => ({
  name: student.name || '',
  collegeId: student.collegeId || '',
  hallTicket: student.hallTicket || '',
  email: student.email || '',
  phone: student.phone || '+91 98765 43210'
});

export default function StudentProfile() {
  const { student, updateStudentProfile } = useClearance();

  const [formData, setFormData] = useState(() => getFormData(student));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setSavedSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateStudentProfile(formData);
    setSavedSuccess(true);

    window.setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleReset = () => {
    setFormData(getFormData(student));
    setSavedSuccess(false);
  };

  const inputClass =
    'mt-2 h-10 w-full rounded-md border border-[#d7e2f2] bg-white px-3 text-xs text-[#172b55] outline-none transition-all focus:border-[#4d75f6] focus:ring-2 focus:ring-[#4d75f6]/10';

  return (
    <div className="mx-auto w-full max-w-5xl text-[#172b55]">

      {/* =====================================================
          STUDENT PROFILE BANNER
          ===================================================== */}
      <div
        className="
          relative
          mb-5
          h-[115px]
          w-full
          overflow-hidden
          rounded-xl
          border
          border-[#dce7f7]
          bg-[#eaf2ff]
          shadow-[0_6px_22px_rgba(48,78,137,0.07)]
        "
      >

        <div className="absolute inset-0 bg-gradient-to-br from-[#dcecff] via-[#c8ddfa] to-[#a8c9f0]" />

        {/* =================================================
            LEFT SIDE CONTENT
            ================================================= */}
        <div className="relative z-10 flex h-full items-center px-5 sm:px-7">

          {/* Avatar */}
          <div
            className="
              relative
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#3969f5]
              text-xl
              font-semibold
              text-white
              shadow-[0_5px_15px_rgba(57,105,245,0.30)]
            "
          >
            {(formData.name.charAt(0) || 'S').toUpperCase()}

            {/* Online status */}
            <span
              className="
                absolute
                bottom-0
                right-0
                h-3.5
                w-3.5
                rounded-full
                border-2
                border-[#eaf2ff]
                bg-[#16c784]
              "
            />
          </div>

          {/* Text */}
          <div className="ml-4 min-w-0">

            <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#58709c]">
              Student Profile
            </p>

            <h1 className="mt-0.5 truncate text-xl font-bold leading-tight text-[#102657] sm:text-2xl">
              {formData.name || 'Student'}
            </h1>

            <p className="mt-1 text-[9px] text-[#60749c] sm:text-[10px]">
              Keep your personal information updated for a smooth No-Dues process.
            </p>

          </div>
        </div>

        {/* =================================================
            RIGHT SIDE SLOGAN
            ================================================= */}
        <div
          className="
            absolute
            right-[14%]
            top-3
            z-10
            hidden
            rotate-[-4deg]
            text-center
            sm:block
          "
        >
        </div>
      </div>

      {/* =====================================================
          PERSONAL INFORMATION CARD
          ===================================================== */}
      <div className="overflow-hidden rounded-2xl border border-[#dfe8f6] bg-white shadow-[0_12px_35px_rgba(48,78,137,0.08)]">

        <form onSubmit={handleSubmit} className="p-5 sm:p-8">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-[#edf1f8] pb-4">

            <div className="flex items-center gap-3">

              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5678fa] text-white shadow-sm">
                <UserRound className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-base font-bold text-[#162b59] sm:text-lg">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[11px] text-[#7183a5] sm:text-xs">
                  Your basic details and contact information
                </p>
              </div>

            </div>

            {/* Active student */}
            <span className="flex items-center gap-1.5 rounded-full bg-[#e5faf2] px-3 py-1.5 text-[10px] font-semibold text-[#16a875]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#16c788]" />

              Active Student

            </span>

          </div>

          {/* =================================================
              FORM FIELDS
              ================================================= */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">

            {/* Full Name */}
            <label className="relative block pl-11 text-[11px] font-semibold text-[#1b2d52]">

              <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fd] text-[#17366f]">
                <User className="h-4 w-4" />
              </span>

              Full Name

              <input
                aria-label="Full Name"
                className={`${inputClass} text-xs`}
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />

            </label>

            {/* College ID */}
            <label className="relative block pl-11 text-[11px] font-semibold text-[#1b2d52]">

              <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fd] text-[#17366f]">
                <FileText className="h-4 w-4" />
              </span>

              University / College ID

              <input
                aria-label="University or College ID"
                className={`${inputClass} text-xs`}
                type="text"
                name="collegeId"
                required
                value={formData.collegeId}
                onChange={handleChange}
              />

            </label>

            {/* Hall Ticket */}
            <label className="relative block pl-11 text-[11px] font-semibold text-[#1b2d52]">

              <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fd] text-[#17366f]">
                <FileText className="h-4 w-4" />
              </span>

              Hall Ticket Number

              <input
                aria-label="Hall Ticket Number"
                className={`${inputClass} text-xs`}
                type="text"
                name="hallTicket"
                value={formData.hallTicket}
                onChange={handleChange}
              />

            </label>

            {/* Email */}
            <label className="relative block pl-11 text-[11px] font-semibold text-[#1b2d52]">

              <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fd] text-[#17366f]">
                <Mail className="h-4 w-4" />
              </span>

              Email Address

              <input
                aria-label="Email Address"
                className={`${inputClass} text-xs`}
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />

            </label>

            {/* Phone */}
            <label className="relative block pl-11 text-[11px] font-semibold text-[#1b2d52]">

              <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fd] text-[#17366f]">
                <Phone className="h-4 w-4" />
              </span>

              Phone Number

              <input
                aria-label="Phone Number"
                className={`${inputClass} text-xs`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

            </label>

          </div>

          {/* =================================================
              FOOTER
              ================================================= */}
          <div className="mt-7 flex flex-col gap-4 border-t border-[#edf1f8] pt-5 sm:flex-row sm:items-center">

            <div className="flex gap-2">

              {/* Save */}
              <button
                type="submit"
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#315ef4]
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_4px_10px_rgba(49,94,244,0.2)]
                  transition-all
                  hover:bg-[#244bd2]
                  active:scale-[0.98]
                "
              >
                {savedSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {savedSuccess ? 'Saved' : 'Save Changes'}
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[#d9e2f3]
                  bg-white
                  px-4
                  text-xs
                  font-semibold
                  text-[#273b63]
                  transition-all
                  hover:bg-[#f5f8fe]
                  active:scale-[0.98]
                "
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

            </div>

            <p className="text-[10px] text-[#8493ad] sm:ml-auto">
              Last updated: 12 Nov 2024, 10:32 AM
            </p>

          </div>

        </form>
      </div>

      {/* Success message */}
      {savedSuccess && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#159b6d]">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully.
        </div>
      )}

    </div>
  );
}


