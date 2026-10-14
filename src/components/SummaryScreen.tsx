import React, { useState } from 'react';
import { SessionSummary, StudentProfile } from '../types/math';
import { BeVuong, ThoToanHoc } from './Characters';
import { Award, Star, CheckCircle, RefreshCw, Trophy, Home, RotateCcw, AlertTriangle, CloudCheck, CloudOff } from 'lucide-react';
import { QUESTIONS } from '../data/questions';

interface SummaryScreenProps {
  summary: SessionSummary;
  student: StudentProfile;
  syncStatus: 'demo' | 'synced' | 'error' | 'syncing';
  onRetrySync: () => void;
  onPracticeMore: () => void;
  onGoHome: () => void;
  onGoLeaderboard: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  summary,
  student,
  syncStatus,
  onRetrySync,
  onPracticeMore,
  onGoHome,
  onGoLeaderboard
}) => {
  const [showSolutionList, setShowSolutionList] = useState(false);

  const totalAnswered = summary.totalQuestions;
  const totalCorrect = summary.correctFirstTry + summary.correctSecondTry;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Compute stars awarded
  let starsEarned = 1;
  if (accuracy >= 85) starsEarned = 3;
  else if (accuracy >= 60) starsEarned = 2;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Victory Card */}
      <div className="bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl text-center relative overflow-hidden border-4 border-white">
        <div className="flex justify-center mb-2">
          <BeVuong size="lg" mood="celebrating" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>Hoàn thành buổi học</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black mb-1">
          CHÚC MỪNG {student.fullName.toUpperCase()}! 🌟
        </h1>
        <p className="text-sky-100 text-sm max-w-md mx-auto font-medium">
          Con đã xuất sắc hoàn thành tất cả câu hỏi trong hành trình khám phá diện tích hôm nay!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl transition-all transform ${
                starIdx <= starsEarned
                  ? 'bg-amber-400 text-amber-950 scale-110 shadow-lg'
                  : 'bg-white/20 text-white/40'
              }`}
            >
              <Star className="w-8 h-8 fill-current stroke-current" />
            </div>
          ))}
        </div>

        {/* Total Points Badge */}
        <div className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-2.5 rounded-2xl shadow-lg font-black text-lg">
          <Award className="w-6 h-6 text-amber-500" />
          <span>+{summary.totalPoints} Điểm Nhận Được</span>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div
        className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
          syncStatus === 'synced'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : syncStatus === 'demo'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : syncStatus === 'syncing'
            ? 'bg-sky-50 border-sky-300 text-sky-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {syncStatus === 'synced' && <CloudCheck className="w-5 h-5 text-emerald-600 shrink-0" />}
          {syncStatus === 'demo' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          {syncStatus === 'syncing' && <RefreshCw className="w-5 h-5 text-sky-600 animate-spin shrink-0" />}
          {syncStatus === 'error' && <CloudOff className="w-5 h-5 text-rose-600 shrink-0" />}

          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {syncStatus === 'synced' && 'Đã đồng bộ lên Google Sheets'}
              {syncStatus === 'demo' && 'Chế độ xem thử (DEMO) - Chưa kết nối Google Sheets'}
              {syncStatus === 'syncing' && 'Đang gửi dữ liệu lên Google Sheets...'}
              {syncStatus === 'error' && 'Chưa thể kết nối Google Sheets'}
            </p>
            <p className="text-xs opacity-80 font-medium">
              {syncStatus === 'synced' && 'Điểm số và xếp hạng của con đã được cập nhật thành công!'}
              {syncStatus === 'demo' && 'Dữ liệu được lưu trữ trên trình duyệt của con an toàn.'}
              {syncStatus === 'syncing' && 'Vui lòng chờ trong giây lát...'}
              {syncStatus === 'error' && 'Dữ liệu đang được lưu tạm trên máy. Con có thể bấm nút thử lại.'}
            </p>
          </div>
        </div>

        {syncStatus === 'error' && (
          <button
            type="button"
            onClick={onRetrySync}
            className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-1">Tổng số câu</span>
          <span className="text-2xl font-black text-slate-800">{summary.totalQuestions}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-emerald-600 font-bold block mb-1">Đúng lần 1 (+10đ)</span>
          <span className="text-2xl font-black text-emerald-600">{summary.correctFirstTry}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-amber-600 font-bold block mb-1">Đúng lần 2 (+5đ)</span>
          <span className="text-2xl font-black text-amber-600">{summary.correctSecondTry}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs text-rose-600 font-bold block mb-1">Chưa đúng sau 2 lần</span>
          <span className="text-2xl font-black text-rose-600">{summary.wrongCount}</span>
        </div>
      </div>

      {/* Accuracy Progress Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">Độ chính xác hoàn thành</span>
          <span className="text-sky-600 text-sm font-extrabold">{accuracy}%</span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${accuracy}%` }}
          ></div>
        </div>
      </div>

      {/* Solution List Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowSolutionList(!showSolutionList)}
          className="w-full p-4 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 text-sm cursor-pointer"
        >
          <span>Xem lại danh sách lời giải từng câu ({summary.questionResults.length} câu)</span>
          <span className="text-xs text-sky-600">{showSolutionList ? 'Ẩn đi ▲' : 'Mở xem ▼'}</span>
        </button>

        {showSolutionList && (
          <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
            {summary.questionResults.map((res, idx) => {
              const q = QUESTIONS.find((x) => x.id === res.questionId);
              if (!q) return null;

              return (
                <div key={res.questionId} className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800">
                      Câu {idx + 1}: {q.title}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        res.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.isCorrect ? `Đúng (+${res.pointsAwarded}đ)` : 'Chưa đúng (0đ)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium whitespace-pre-line">
                    <strong>Lời giải:</strong> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={onPracticeMore}
          className="py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold shadow-md hover:from-sky-600 hover:to-blue-700 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Luyện tập tiếp</span>
        </button>

        <button
          type="button"
          onClick={onGoLeaderboard}
          className="py-3.5 px-4 bg-amber-400 text-amber-950 rounded-2xl font-black shadow-md hover:bg-amber-500 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Trophy className="w-4 h-4" />
          <span>Xem Bảng Xếp Hạng</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="py-3.5 px-4 bg-slate-100 text-slate-700 border border-slate-300 rounded-2xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </button>
      </div>
    </div>
  );
};
