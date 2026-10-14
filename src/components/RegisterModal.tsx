import React, { useState } from 'react';
import { StudentProfile } from '../types/math';
import { BeVuong, BeChuNhat, ThoToanHoc } from './Characters';
import { soundService } from '../services/soundService';
import { Sparkles, ArrowRight, ShieldCheck, User, School, BookOpen } from 'lucide-react';

interface RegisterModalProps {
  onRegisterComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

const AVATARS = [
  { id: 'be_vuong', label: 'Bé Vuông', component: <BeVuong size="sm" mood="cheering" /> },
  { id: 'be_chu_nhat', label: 'Bé Chữ Nhật', component: <BeChuNhat size="sm" mood="happy" /> },
  { id: 'tho_toan', label: 'Thỏ Toán Học', component: <ThoToanHoc size="sm" /> }
];

export const RegisterModal: React.FC<RegisterModalProps> = ({
  onRegisterComplete,
  initialProfile
}) => {
  const [fullName, setFullName] = useState<string>(initialProfile?.fullName || '');
  const [displayName, setDisplayName] = useState<string>(initialProfile?.displayName || '');
  const [school, setSchool] = useState<string>(initialProfile?.school || '');
  const [className, setClassName] = useState<string>(initialProfile?.className || '');
  const [avatarId, setAvatarId] = useState<string>(initialProfile?.avatarId || 'be_vuong');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();

    const cleanFullName = fullName.trim();
    const cleanSchool = school.trim();
    const cleanClassName = className.trim();
    const cleanDisplayName = displayName.trim() || cleanFullName;

    if (!cleanFullName) {
      setErrorMessage('Vui lòng nhập Họ và tên của con nhé!');
      return;
    }
    if (!cleanSchool) {
      setErrorMessage('Vui lòng nhập Tên trường học của con!');
      return;
    }
    if (!cleanClassName) {
      setErrorMessage('Vui lòng nhập Lớp học của con (ví dụ: 3A1, 3B)!');
      return;
    }

    // Generate or reuse stable student ID
    const studentId =
      initialProfile?.studentId ||
      'st_' +
        cleanFullName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '_')
          .slice(0, 15) +
        '_' +
        Math.floor(1000 + Math.random() * 9000);

    const now = new Date().toISOString();
    const newProfile: StudentProfile = {
      studentId,
      fullName: cleanFullName,
      displayName: cleanDisplayName,
      school: cleanSchool,
      className: cleanClassName,
      avatarId,
      points: initialProfile?.points || 0,
      xp: initialProfile?.xp || 0,
      completedQuestions: initialProfile?.completedQuestions || 0,
      stars: initialProfile?.stars || 0,
      badges: initialProfile?.badges || ['Huy hiệu Nhập Môn'],
      streakDays: initialProfile?.streakDays || 1,
      createdAt: initialProfile?.createdAt || now,
      lastActiveAt: now
    };

    onRegisterComplete(newProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white animate-in fade-in zoom-in-95">
        {/* Banner with Cute Characters */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BeVuong size="md" mood="cheering" />
            <ThoToanHoc size="md" />
            <BeChuNhat size="md" mood="happy" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Đăng Ký Hồ Sơ Học Tập</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-800">
            VƯƠNG QUỐC DIỆN TÍCH
          </h1>
          <p className="text-slate-600 text-xs md:text-sm font-medium mt-1">
            Chào mừng con! Nhập thông tin để ghi nhận điểm số và xếp hạng toàn quốc nhé!
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2 text-center">
              Chọn nhân vật đồng hành yêu thích của con:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((av) => {
                const isSelected = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setAvatarId(av.id);
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300 scale-105 shadow-md'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    {av.component}
                    <span className="text-xs font-bold text-slate-700">{av.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Họ và tên học sinh *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Minh Anh"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all"
            />
          </div>

          {/* School & Class side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-sky-600" />
                <span>Trường tiểu học *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tiểu học Thăng Long"
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Lớp *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 3A1 hoặc 3B"
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Nickname / Display Name (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Biệt danh hiển thị trên Bảng Xếp Hạng (tùy chọn):
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">Bảo vệ riêng tư</span>
            </div>
            <input
              type="text"
              placeholder="Ví dụ: Thỏ Thông Thái (mặc định lấy theo tên)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-sky-500 text-xs font-medium text-slate-800 outline-none"
            />
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-2xl border border-sky-100 text-sky-900 text-[11px] font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Hệ thống lưu giữ tiến độ học tập an toàn. Tên họ đầy đủ không bị công khai trên bảng xếp hạng toàn quốc.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 rounded-2xl font-black text-base shadow-lg shadow-amber-500/30 hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>VÀO HỌC NGAY</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
