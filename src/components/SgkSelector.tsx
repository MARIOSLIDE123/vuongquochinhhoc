import React from 'react';
import { QUESTIONS } from '../data/questions';
import { soundService } from '../services/soundService';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Play } from 'lucide-react';

interface SgkSelectorProps {
  studentName: string;
  completedIds: Set<string>;
  onSelectQuestion: (questionId: string) => void;
  onStartAllSgk: () => void;
  onBackToHome: () => void;
}

export const SgkSelector: React.FC<SgkSelectorProps> = ({
  studentName,
  completedIds,
  onSelectQuestion,
  onStartAllSgk,
  onBackToHome
}) => {
  const sgkQuestions = QUESTIONS.filter((q) => q.category === 'sgk');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Toán Tiểu Học - Lớp 3 &amp; 4</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">BÀI TẬP THEO SÁCH GIÁO KHOA</h1>
          <p className="text-emerald-100 text-xs md:text-sm font-medium mt-1">
            {studentName} có thể làm lần lượt trọn vẹn cả bài hoặc chọn từng bài để luyện tập nhé!
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onStartAllSgk();
          }}
          className="px-6 py-3.5 bg-white text-emerald-900 rounded-2xl font-black text-sm shadow-md hover:bg-emerald-50 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Làm Trọn Bộ (5 bài)</span>
        </button>
      </div>

      {/* Grid of SGK Exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sgkQuestions.map((q, idx) => {
          const isDone = completedIds.has(q.id);

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Bài {idx + 1}
                  </span>
                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã xong</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">+10 điểm</span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-800 text-base mb-1.5 leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-3">
                  {q.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onSelectQuestion(q.id);
                }}
                className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  isDone
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                }`}
              >
                <span>{isDone ? 'Làm lại bài này' : 'Bắt đầu làm bài'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay về Trang Chủ</span>
      </button>
    </div>
  );
};
