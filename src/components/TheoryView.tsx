import React, { useState } from 'react';
import { BeVuong, BeChuNhat, ThoToanHoc } from './Characters';
import { Sparkles, ArrowRight, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { soundService } from '../services/soundService';

interface TheoryViewProps {
  studentName: string;
  onStartPractice: () => void;
  onBackToHome: () => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  studentName,
  onStartPractice,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'square' | 'rectangle' | 'tips'>('square');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Header Banner - Compact & Wide */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Góc Học Tập Thông Thái</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">ÔN TẬP LÝ THUYẾT DIỆN TÍCH</h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-0.5">
              Chào {studentName}! Cùng Bé Vuông và Bé Chữ Nhật khám phá những công thức tuyệt diệu nhé!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <BeVuong size="sm" mood="cheering" />
            <BeChuNhat size="sm" mood="happy" />
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center justify-center p-1.5 bg-sky-100/90 rounded-2xl max-w-lg mx-auto border border-sky-200">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('square');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'square'
              ? 'bg-white text-amber-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Diện tích Hình Vuông
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('rectangle');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'rectangle'
              ? 'bg-white text-sky-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Diện tích Hình Chữ Nhật
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('tips');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Bí Kíp Ghi Nhớ
        </button>
      </div>

      {/* TAB 1: SQUARE */}
      {activeTab === 'square' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <BeVuong size="sm" mood="happy" />
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-950">Diện Tích Hình Vuông</h2>
                <p className="text-xs text-amber-700">Hình vuông có 4 cạnh dài bằng nhau!</p>
              </div>
            </div>

            <div className="bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold">
              💡 “Diện tích là phần mặt phẳng nằm bên trong hình”
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left: Formula Card */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl p-4 text-center text-amber-950 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-80">
                  Quy tắc tính diện tích hình vuông
                </span>
                <div className="text-xl sm:text-2xl font-black my-1">
                  Diện tích = Cạnh × Cạnh
                </div>
                <div className="text-base sm:text-lg font-bold font-mono">
                  S = a × a
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs sm:text-sm font-semibold text-slate-800">
                <p className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide text-amber-800">
                  Ví dụ minh họa:
                </p>
                <p className="text-slate-700">Hình vuông có cạnh <strong>5 cm</strong>. Tính diện tích?</p>
                <p className="text-amber-700 pt-1 font-bold">Diện tích hình vuông là:</p>
                <p className="font-mono text-base font-extrabold text-slate-900">5 × 5 = 25 (cm²)</p>
                <p className="text-emerald-700 font-bold">Đáp số: 25 cm²</p>
              </div>

              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                ⚠️ Cạnh có đơn vị <strong>cm</strong>, diện tích có đơn vị <strong>cm²</strong> (xăng-ti-mét vuông).
              </div>
            </div>

            {/* Right: Precise 5x5 SVG Grid (Requirement 4: exact 25 square cells, zero clipping) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80">
              <svg viewBox="0 0 200 190" className="w-52 h-50 sm:w-60 sm:h-56 drop-shadow-xs">
                {/* Top dimension */}
                <line x1="30" y1="16" x2="170" y2="16" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 30 11 L 30 21" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 170 11 L 170 21" stroke="#0284c7" strokeWidth="1.8" />
                <text x="100" y="12" fill="#0369a1" fontSize="12" fontWeight="800" textAnchor="middle">
                  Cạnh: 5 cm (5 ô)
                </text>

                {/* Right dimension */}
                <line x1="178" y1="26" x2="178" y2="166" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 173 26 L 183 26" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 173 166 L 183 166" stroke="#0284c7" strokeWidth="1.8" />
                <text x="184" y="100" fill="#0369a1" fontSize="12" fontWeight="800" textAnchor="start">
                  5 cm
                </text>

                {/* Draw exactly 5 rows x 5 cols = 25 uniform square cells (28px each) starting at x=30, y=26 */}
                {Array.from({ length: 5 }).map((_, row) =>
                  Array.from({ length: 5 }).map((_, col) => (
                    <rect
                      key={`sq-${row}-${col}`}
                      x={30 + col * 28}
                      y={26 + row * 28}
                      width={28}
                      height={28}
                      fill="#fef08a"
                      stroke="#ca8a04"
                      strokeWidth="1.2"
                    />
                  ))
                )}

                {/* Outer square border */}
                <rect x="30" y="26" width="140" height="140" fill="none" stroke="#a16207" strokeWidth="3" rx="4" />

                {/* Center Badge */}
                <rect x="52" y="82" width="96" height="28" rx="6" fill="#ffffff" opacity="0.95" stroke="#ca8a04" strokeWidth="1.5" />
                <text x="100" y="101" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="900">
                  25 ô = 25 cm²
                </text>
              </svg>
              <span className="text-xs text-amber-900 mt-1 font-semibold text-center">
                Mỗi ô vuông = 1 cm² · Gồm 5 hàng, mỗi hàng có 5 ô vuông đơn vị
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECTANGLE */}
      {activeTab === 'rectangle' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-200 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <BeChuNhat size="sm" mood="happy" />
              <div>
                <h2 className="text-lg sm:text-xl font-black text-sky-950">Diện Tích Hình Chữ Nhật</h2>
                <p className="text-xs text-sky-700">Chiều dài và chiều rộng phải cùng đơn vị đo!</p>
              </div>
            </div>

            <div className="bg-sky-50 px-3 py-1 rounded-xl border border-sky-200 text-xs text-sky-900 font-semibold">
              💡 Tổng số ô vuông = Số ô của 1 hàng × Số hàng
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left: Formula Card */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl p-4 text-center text-white shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">
                  Quy tắc tính diện tích hình chữ nhật
                </span>
                <div className="text-xl sm:text-2xl font-black my-1">
                  Diện tích = Chiều Dài × Chiều Rộng
                </div>
                <div className="text-base sm:text-lg font-bold font-mono">
                  S = a × b
                </div>
                <span className="text-[11px] opacity-90 block mt-0.5">(cùng một đơn vị đo)</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs sm:text-sm font-semibold text-slate-800">
                <p className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide text-sky-800">
                  Ví dụ minh họa:
                </p>
                <p className="text-slate-700">Dài <strong>8 cm</strong> và rộng <strong>4 cm</strong>. Tính diện tích?</p>
                <p className="text-sky-700 pt-1 font-bold">Diện tích hình chữ nhật là:</p>
                <p className="font-mono text-base font-extrabold text-slate-900">8 × 4 = 32 (cm²)</p>
                <p className="text-emerald-700 font-bold">Đáp số: 32 cm²</p>
              </div>
            </div>

            {/* Right: Precise 8x4 SVG Grid (Requirement 4: exact 32 square cells, zero clipping) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 bg-sky-50/50 rounded-2xl border border-sky-200/80">
              <svg viewBox="0 0 240 150" className="w-64 h-40 sm:w-72 sm:h-44 drop-shadow-xs">
                {/* Top dimension (Length) */}
                <line x1="25" y1="18" x2="201" y2="18" stroke="#0369a1" strokeWidth="1.8" />
                <path d="M 25 13 L 25 23" stroke="#0369a1" strokeWidth="1.8" />
                <path d="M 201 13 L 201 23" stroke="#0369a1" strokeWidth="1.8" />
                <text x="113" y="14" fill="#0369a1" fontSize="12" fontWeight="800" textAnchor="middle">
                  Chiều dài: 8 cm (8 ô)
                </text>

                {/* Right dimension (Width) */}
                <line x1="209" y1="26" x2="209" y2="114" stroke="#0369a1" strokeWidth="1.8" />
                <path d="M 204 26 L 214 26" stroke="#0369a1" strokeWidth="1.8" />
                <path d="M 204 114 L 214 114" stroke="#0369a1" strokeWidth="1.8" />
                <text x="215" y="74" fill="#0369a1" fontSize="11" fontWeight="800" textAnchor="start">
                  4 cm
                </text>

                {/* Draw exactly 4 rows x 8 cols = 32 uniform square cells (22px each) starting at x=25, y=26 */}
                {Array.from({ length: 4 }).map((_, row) =>
                  Array.from({ length: 8 }).map((_, col) => (
                    <rect
                      key={`rect-${row}-${col}`}
                      x={25 + col * 22}
                      y={26 + row * 22}
                      width={22}
                      height={22}
                      fill="#bae6fd"
                      stroke="#0284c7"
                      strokeWidth="1"
                    />
                  ))
                )}

                {/* Outer border */}
                <rect x="25" y="26" width="176" height="88" fill="none" stroke="#0369a1" strokeWidth="3" rx="4" />

                {/* Center Badge */}
                <rect x="65" y="56" width="96" height="28" rx="6" fill="#ffffff" opacity="0.95" stroke="#0369a1" strokeWidth="1.5" />
                <text x="113" y="75" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="900">
                  32 ô = 32 cm²
                </text>
              </svg>
              <span className="text-xs text-sky-900 mt-1 font-semibold text-center">
                Mỗi ô vuông = 1 cm² · Gồm 4 hàng, mỗi hàng có 8 ô vuông đơn vị
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIPS & COMMON PITFALLS */}
      {activeTab === 'tips' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <ThoToanHoc size="sm" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-emerald-950">Bí Kíp Ghi Nhớ Của Thỏ Trắng</h2>
              <p className="text-xs text-emerald-700">Những mẹo vàng để luôn làm đúng 100% bài thi!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>1. Phân biệt Chu vi &amp; Diện tích</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                • <strong>Chu vi</strong> là viền xung quanh (đơn vị: cm, m).<br />
                • <strong>Diện tích</strong> là phần mặt phẳng bên trong (đơn vị: cm², m²).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-900 font-extrabold text-sm">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>2. Đổi về cùng đơn vị đo</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Nếu chiều dài là <strong>dm</strong>, chiều rộng là <strong>cm</strong>, con phải đổi về cùng <strong>cm</strong> trước khi nhân: S = a × b!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-sm">
                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                <span>3. Bài toán ngược (Biết S tìm cạnh)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                • Hình vuông: Tìm số nào nhân với chính nó bằng diện tích (Ví dụ: S = 49 cm² → cạnh = 7 cm vì 7 × 7 = 49).<br />
                • Hình chữ nhật: Chiều dài = Diện tích : Chiều rộng.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4. Đếm hình trên lưới ô vuông</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                • 2 nửa ô vuông tam giác ghép lại = 1 ô vuông hoàn chỉnh.<br />
                • Với hình có cửa sổ / khoét lỗ: Lấy diện tích hình bao trừ đi diện tích các lỗ khoét!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onBackToHome();
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          ← Quay lại Trang Chủ
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onStartPractice();
          }}
          className="w-full sm:w-auto px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ĐÃ HIỂU BÀI · VÀO LUYỆN TẬP</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
