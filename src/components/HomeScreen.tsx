import React from 'react';
import { StudentProfile } from '../types/math';
import { BeVuong, BeChuNhat, ThoToanHoc } from './Characters';
import { soundService } from '../services/soundService';
import { BookOpen, Trophy, Compass, Star, Award, Target, Flame, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomeScreenProps {
  student: StudentProfile;
  onNavigate: (view: 'theory' | 'sgk_select' | 'practice' | 'leaderboard') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ student, onNavigate }) => {
  // Derived level
  const userLevel = Math.floor((student.points || 0) / 50) + 1;
  const progressToNextLevel = ((student.points || 0) % 50) / 50 * 100;

  // Daily target calculation (e.g. 5 questions per day)
  const dailyTarget = 5;
  const dailyCompleted = Math.min(dailyTarget, student.completedQuestions % dailyTarget || (student.completedQuestions > 0 ? dailyTarget : 0));

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1550px] mx-auto space-y-6">
      {/* AREA 1: STUDENT PROFILE & HERO BANNER */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border-4 border-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Student Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xs p-2 flex items-center justify-center shrink-0 border-2 border-white/40 shadow-inner">
              {student.avatarId === 'be_chu_nhat' ? (
                <BeChuNhat size="md" mood="happy" />
              ) : student.avatarId === 'tho_toan' ? (
                <ThoToanHoc size="md" />
              ) : (
                <BeVuong size="md" mood="cheering" />
              )}
            </div>

            {/* Personalized Greeting */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hiệp Sĩ Toán Học Nhí</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black">
                Chào {student.fullName}! 👋
              </h1>
              <p className="text-sky-100 text-xs md:text-sm font-medium mt-0.5">
                Lớp {student.className} · {student.school}
              </p>
            </div>
          </div>

          {/* Points & Level Stats Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
            {/* Level */}
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-200 block">
                Cấp Độ
              </span>
              <span className="text-xl md:text-2xl font-black text-amber-300">
                Lv.{userLevel}
              </span>
            </div>

            {/* Total Points */}
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-200 block">
                Điểm Tích Lũy
              </span>
              <span className="text-xl md:text-2xl font-black text-white">
                {student.points} <span className="text-xs font-bold text-amber-300">đ</span>
              </span>
            </div>

            {/* Streak */}
            <div className="text-center px-3 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-200 block">
                Chuỗi Ngày
              </span>
              <div className="flex items-center gap-1 text-xl md:text-2xl font-black text-orange-300">
                <Flame className="w-5 h-5 fill-current" />
                <span>{student.streakDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 relative z-10 flex items-center gap-3">
          <span className="text-xs font-bold text-sky-100 shrink-0">
            Tiến độ lên Cấp {userLevel + 1}:
          </span>
          <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${progressToNextLevel}%` }}
            ></div>
          </div>
          <span className="text-xs font-extrabold text-amber-200 shrink-0">
            {Math.round(progressToNextLevel)}%
          </span>
        </div>
      </div>

      {/* AREA 2: 4 MAIN ENTRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Theory */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onNavigate('theory');
          }}
          className="bg-white rounded-3xl p-5 border-2 border-sky-100 hover:border-sky-400 shadow-md hover:shadow-xl transition-all text-left flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Khám Phá
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-1 mb-2">
              ÔN TẬP LÝ THUYẾT
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Công thức diện tích hình vuông, hình chữ nhật và các bí kíp ghi nhớ dễ hiểu!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
            <span>Vào ôn bài</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: SGK Practice */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onNavigate('sgk_select');
          }}
          className="bg-white rounded-3xl p-5 border-2 border-emerald-100 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all text-left flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Chuẩn Sách Giáo Khoa
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-1 mb-2">
              LUYỆN TẬP SGK
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Trọn bộ Bài 1a, 1b, 2, 3 (miếng bìa ngôi nhà) và Bài 4 (vườn rau hình vuông).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>Làm bài SGK</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Challenge Bank */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onNavigate('practice');
          }}
          className="bg-white rounded-3xl p-5 border-2 border-purple-100 hover:border-purple-400 shadow-md hover:shadow-xl transition-all text-left flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              20+ Câu Hỏi Mở Rộng
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-1 mb-2">
              CHINH PHỤC THỬ THÁCH
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              3 cấp độ nhận biết, vận dụng, ghép hình và kéo thả tương tác sinh động!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-700">
            <span>Bắt đầu thử thách</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 4: Leaderboard */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onNavigate('leaderboard');
          }}
          className="bg-white rounded-3xl p-5 border-2 border-amber-100 hover:border-amber-400 shadow-md hover:shadow-xl transition-all text-left flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Bảng Vàng Danh Dự
            </span>
            <h2 className="text-lg font-black text-slate-800 mt-1 mb-2">
              XẾP HẠNG TOÀN QUỐC
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Xem thứ hạng của con hôm nay, tuần này và tích lũy toàn quốc!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span>Xem bảng xếp hạng</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* AREA 3 & 4: DAILY QUEST & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Area 3: Nhiệm vụ hôm nay */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">Nhiệm Vụ Hôm Nay</h3>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {dailyCompleted}/{dailyTarget} câu
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mb-3">
              Mục tiêu: Hoàn thành 5 câu hỏi bất kỳ để rèn luyện thói quen học toán mỗi ngày!
            </p>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 mb-2">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${(dailyCompleted / dailyTarget) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Phần thưởng hoàn thành:</span>
            <span className="font-bold text-amber-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>+20 XP Thưởng</span>
            </span>
          </div>
        </div>

        {/* Area 4: Thành tích */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">Huy Hiệu &amp; Thành Tích</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium mb-3">
              Các danh hiệu được trao dựa trên hoạt động học tập thực tế của con:
            </p>

            <div className="flex flex-wrap gap-2">
              {(student.badges || ['Huy hiệu Nhập Môn']).map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{badge}</span>
                </span>
              ))}
              {student.completedQuestions >= 5 && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-xs flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Chăm Chỉ (5 câu)</span>
                </span>
              )}
              {student.points >= 50 && (
                <span className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-extrabold text-xs flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Dũng Sĩ Diện Tích</span>
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
            Đã hoàn thành tổng cộng: <strong>{student.completedQuestions} câu hỏi</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
