import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question } from '../types/math';
import { GeometryVisualizer } from './GeometryVisualizer';
import { BeVuong, ThoToanHoc } from './Characters';
import { ArrowRight, RotateCcw, Award, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  attemptNumber: 1 | 2;
  question: Question;
  studentName: string;
  onContinue: () => void;
  onRetry: () => void;
  isLastQuestion: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  attemptNumber,
  question,
  studentName,
  onContinue,
  onRetry,
  isLastQuestion
}) => {
  // Fire confetti on correct answer!
  useEffect(() => {
    if (isOpen && isCorrect) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, isCorrect]);

  if (!isOpen) return null;

  const isFirstTryCorrect = isCorrect && attemptNumber === 1;
  const isSecondTryCorrect = isCorrect && attemptNumber === 2;
  const isFirstTryWrong = !isCorrect && attemptNumber === 1;
  const isSecondTryWrong = !isCorrect && attemptNumber === 2;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[92vh]">
        {/* CASE 1: 1st Try Correct */}
        {isFirstTryCorrect && (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BeVuong mood="celebrating" size="lg" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Chính xác ngay lần đầu!</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
              TUYỆT VỜI, {studentName.toUpperCase()}! 🎉
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Con đã tìm ra đáp án chính xác và nhận được trọn vẹn điểm số!
            </p>

            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-amber-900 font-extrabold text-base">+10 Điểm Tích Lũy</span>
            </div>

            {/* Explanation */}
            <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Lời giải tóm tắt:
              </h4>
              <p className="text-sm font-semibold text-slate-700 whitespace-pre-line leading-relaxed">
                {question.explanation}
              </p>
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>{isLastQuestion ? 'Xem tổng kết bài học' : 'Sang câu tiếp theo'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CASE 2: 1st Try Wrong -> Allowed 1 Retry */}
        {isFirstTryWrong && (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ThoToanHoc size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Cố gắng thêm một chút nữa!</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
              GẦN ĐÚNG RỒI, {studentName.toUpperCase()}! 💪
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Con hãy xem lại gợi ý và thử suy nghĩ thêm một lần nữa nhé!
            </p>

            {/* Targeted Hint Card */}
            <div className="text-left bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200 mb-5 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Gợi ý từ Thỏ Toán Học:
                </h4>
              </div>
              <p className="text-sm font-medium text-amber-950 leading-relaxed">
                {question.hint}
              </p>
            </div>

            <button
              type="button"
              onClick={onRetry}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>THỬ LẠI MỘT LẦN (Cơ hội nhận 5 điểm)</span>
            </button>
          </div>
        )}

        {/* CASE 3: 2nd Try Correct */}
        {isSecondTryCorrect && (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BeVuong mood="cheering" size="lg" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tuyệt vời! Con đã sửa đúng!</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
              GIỎI LẮM, {studentName.toUpperCase()}! 🌟
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Con rất kiên trì và đã vượt qua thử thách thành công!
            </p>

            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-amber-900 font-extrabold text-base">+5 Điểm Tích Lũy</span>
            </div>

            {/* Solution and Diagram */}
            <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Lời giải hoàn chỉnh:
              </h4>
              <p className="text-sm font-semibold text-slate-700 whitespace-pre-line leading-relaxed mb-2">
                {question.explanation}
              </p>
              <GeometryVisualizer geometry={question.geometry} isSolutionView={true} />
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>{isLastQuestion ? 'Xem tổng kết bài học' : 'Sang câu tiếp theo'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CASE 4: 2nd Try Wrong -> Reveal Answer & Lock */}
        {isSecondTryWrong && (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ThoToanHoc size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider mb-2">
              <span>Đã hết lượt trả lời</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
              Không sao đâu {studentName}! 💙
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Toán học là hành trình học hỏi từ những sai sót. Chúng mình cùng xem lời giải chi tiết nhé!
            </p>

            {/* Complete Solution and Visual diagram */}
            <div className="text-left bg-sky-50/70 p-4 rounded-2xl border-2 border-sky-200 mb-5">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1.5">
                Đáp án chuẩn và Lời giải:
              </h4>
              <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed mb-3">
                {question.explanation}
              </p>
              <GeometryVisualizer geometry={question.geometry} isSolutionView={true} />
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>{isLastQuestion ? 'Xem tổng kết bài học' : 'Tiếp tục hành trình'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
