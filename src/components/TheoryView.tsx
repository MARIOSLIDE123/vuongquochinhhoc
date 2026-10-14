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
    <div className="w-full max-w-7xl 2xl:max-w-[1550px] mx-auto space-y-4 sm:space-y-6">
      {/* Header Banner - Full Widescreen 16:9 */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Góc Học Tập Thông Thái</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              ÔN TẬP LÝ THUYẾT DIỆN TÍCH
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm lg:text-base mt-1">
              Chào {studentName}! Cùng Bé Vuông và Bé Chữ Nhật khám phá những công thức tuyệt diệu nhé!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <BeVuong size="md" mood="cheering" />
            <BeChuNhat size="md" mood="happy" />
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls - WIDE, NON-WRAPPING BUTTONS ON 1 LINE */}
      <div className="flex items-center justify-start sm:justify-center p-1.5 sm:p-2 bg-sky-100/90 rounded-2xl w-full max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mx-auto border border-sky-200 shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('square');
          }}
          className={`shrink-0 sm:flex-1 py-3 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm lg:text-base whitespace-nowrap text-center transition-all cursor-pointer ${
            activeTab === 'square'
              ? 'bg-white text-amber-900 shadow-sm ring-1 ring-amber-200'
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
          className={`shrink-0 sm:flex-1 py-3 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm lg:text-base whitespace-nowrap text-center transition-all cursor-pointer ${
            activeTab === 'rectangle'
              ? 'bg-white text-sky-900 shadow-sm ring-1 ring-sky-200'
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
          className={`shrink-0 sm:flex-1 py-3 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm lg:text-base whitespace-nowrap text-center transition-all cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Bí Kíp Ghi Nhớ
        </button>
      </div>

      {/* TAB 1: SQUARE */}
      {activeTab === 'square' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-9 border-2 border-amber-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <BeVuong size="sm" mood="happy" />
              <div>
                {/* Single line title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-950 whitespace-nowrap">
                  Diện Tích Hình Vuông
                </h2>
                <p className="text-xs sm:text-sm text-amber-700 font-medium">Hình vuông có 4 cạnh dài bằng nhau!</p>
              </div>
            </div>

            <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold shadow-2xs">
              💡 “Diện tích là phần mặt phẳng nằm bên trong hình”
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left: Formula & Step-by-step */}
            <div className="lg:col-span-5 space-y-4">
              {/* Formula Banner - Big text for 16:9 */}
              <div className="bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-400 rounded-3xl p-5 lg:p-7 text-center text-amber-950 shadow-md">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider block opacity-85">
                  Quy tắc tính diện tích hình vuông
                </span>
                <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black my-2">
                  Diện tích = Cạnh × Cạnh
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono tracking-wide">
                  S = a × a
                </div>
              </div>

              {/* Example Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm sm:text-base font-semibold text-slate-800">
                <p className="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-wider text-amber-800">
                  Ví dụ minh họa cụ thể:
                </p>
                <p className="text-slate-700">
                  Một hình vuông có cạnh dài <strong>5 cm</strong>. Tính diện tích của hình vuông đó?
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-amber-800 font-bold">Bài giải:</p>
                  <p className="text-slate-700">Diện tích hình vuông là:</p>
                  <p className="font-mono text-lg sm:text-xl font-black text-slate-900">
                    5 × 5 = 25 (cm²)
                  </p>
                  <p className="text-emerald-700 font-black text-base">Đáp số: 25 cm²</p>
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 font-semibold">
                ⚠️ Độ dài cạnh có đơn vị là <strong>cm</strong>, diện tích có đơn vị là <strong>cm²</strong> (xăng-ti-mét vuông).
              </div>
            </div>

            {/* Right: Enlarged 5x5 SVG Grid - Big & Clear on 16:9 Screen */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-amber-50/70 to-yellow-50/30 rounded-3xl border-2 border-amber-200/80 min-h-[380px] lg:min-h-[460px]">
              <svg viewBox="0 0 240 230" className="w-72 h-68 sm:w-88 sm:h-84 lg:w-[420px] lg:h-[400px] 2xl:w-[480px] 2xl:h-[460px] drop-shadow-md transition-all">
                {/* Top dimension line */}
                <line x1="35" y1="20" x2="205" y2="20" stroke="#0284c7" strokeWidth="2.2" />
                <path d="M 35 14 L 35 26" stroke="#0284c7" strokeWidth="2.2" />
                <path d="M 205 14 L 205 26" stroke="#0284c7" strokeWidth="2.2" />
                <text x="120" y="15" fill="#0369a1" fontSize="14" fontWeight="900" textAnchor="middle">
                  Cạnh: 5 cm (5 ô vuông)
                </text>

                {/* Right dimension line */}
                <line x1="215" y1="32" x2="215" y2="202" stroke="#0284c7" strokeWidth="2.2" />
                <path d="M 209 32 L 221 32" stroke="#0284c7" strokeWidth="2.2" />
                <path d="M 209 202 L 221 202" stroke="#0284c7" strokeWidth="2.2" />
                <text x="223" y="122" fill="#0369a1" fontSize="14" fontWeight="900" textAnchor="start">
                  5 cm
                </text>

                {/* Draw exactly 5 rows x 5 cols = 25 uniform square cells (34px each) starting at x=35, y=32 */}
                {Array.from({ length: 5 }).map((_, row) =>
                  Array.from({ length: 5 }).map((_, col) => (
                    <rect
                      key={`sq-${row}-${col}`}
                      x={35 + col * 34}
                      y={32 + row * 34}
                      width={34}
                      height={34}
                      fill="#fef08a"
                      stroke="#ca8a04"
                      strokeWidth="1.2"
                    />
                  ))
                )}

                {/* Outer square border */}
                <rect x="35" y="32" width="170" height="170" fill="none" stroke="#a16207" strokeWidth="3.5" rx="6" />

                {/* Center Formula Badge */}
                <rect x="65" y="100" width="110" height="34" rx="8" fill="#ffffff" opacity="0.96" stroke="#ca8a04" strokeWidth="2" />
                <text x="120" y="123" textAnchor="middle" fill="#78350f" fontSize="15" fontWeight="900">
                  25 ô = 25 cm²
                </text>
              </svg>

              <span className="text-sm sm:text-base text-amber-950 mt-3 font-extrabold text-center">
                Mỗi ô vuông nhỏ = 1 cm² · Gồm 5 hàng, mỗi hàng có 5 ô vuông đơn vị
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECTANGLE */}
      {activeTab === 'rectangle' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-9 border-2 border-sky-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <BeChuNhat size="sm" mood="happy" />
              <div>
                {/* Single line title for Rectangle */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-sky-950 whitespace-nowrap">
                  Diện Tích Hình Chữ Nhật
                </h2>
                <p className="text-xs sm:text-sm text-sky-700 font-medium">Chiều dài và chiều rộng phải cùng đơn vị đo!</p>
              </div>
            </div>

            <div className="bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 text-xs sm:text-sm text-sky-900 font-bold shadow-2xs">
              💡 Tổng số ô vuông = Số ô của 1 hàng × Số hàng
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left: Formula & Step-by-step */}
            <div className="lg:col-span-5 space-y-4">
              {/* Formula Banner - Big text for 16:9 */}
              <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-5 lg:p-7 text-center text-white shadow-md">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider block opacity-90">
                  Quy tắc tính diện tích hình chữ nhật
                </span>
                <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black my-2">
                  Diện tích = Chiều Dài × Chiều Rộng
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono tracking-wide">
                  S = a × b
                </div>
                <span className="text-xs sm:text-sm opacity-90 block mt-1">(cùng một đơn vị đo)</span>
              </div>

              {/* Example Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm sm:text-base font-semibold text-slate-800">
                <p className="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-wider text-sky-800">
                  Ví dụ minh họa cụ thể:
                </p>
                <p className="text-slate-700">
                  Hình chữ nhật có <strong>chiều dài 8 cm</strong> và <strong>chiều rộng 4 cm</strong>. Tính diện tích?
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-sky-800 font-bold">Bài giải:</p>
                  <p className="text-slate-700">Diện tích hình chữ nhật là:</p>
                  <p className="font-mono text-lg sm:text-xl font-black text-slate-900">
                    8 × 4 = 32 (cm²)
                  </p>
                  <p className="text-emerald-700 font-black text-base">Đáp số: 32 cm²</p>
                </div>
              </div>
            </div>

            {/* Right: Enlarged 8x4 SVG Grid - Big & Clear on 16:9 Screen */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-sky-50/70 to-blue-50/30 rounded-3xl border-2 border-sky-200/80 min-h-[380px] lg:min-h-[460px]">
              <svg viewBox="0 0 280 180" className="w-80 h-50 sm:w-96 sm:h-60 lg:w-[500px] lg:h-[320px] 2xl:w-[580px] 2xl:h-[370px] drop-shadow-md transition-all">
                {/* Top dimension (Length) */}
                <line x1="28" y1="20" x2="236" y2="20" stroke="#0369a1" strokeWidth="2.2" />
                <path d="M 28 14 L 28 26" stroke="#0369a1" strokeWidth="2.2" />
                <path d="M 236 14 L 236 26" stroke="#0369a1" strokeWidth="2.2" />
                <text x="132" y="15" fill="#0369a1" fontSize="14" fontWeight="900" textAnchor="middle">
                  Chiều dài: 8 cm (8 ô)
                </text>

                {/* Right dimension (Width) */}
                <line x1="246" y1="32" x2="246" y2="136" stroke="#0369a1" strokeWidth="2.2" />
                <path d="M 240 32 L 252 32" stroke="#0369a1" strokeWidth="2.2" />
                <path d="M 240 136 L 252 136" stroke="#0369a1" strokeWidth="2.2" />
                <text x="254" y="89" fill="#0369a1" fontSize="14" fontWeight="900" textAnchor="start">
                  4 cm
                </text>

                {/* Draw exactly 4 rows x 8 cols = 32 uniform square cells (26px each) starting at x=28, y=32 */}
                {Array.from({ length: 4 }).map((_, row) =>
                  Array.from({ length: 8 }).map((_, col) => (
                    <rect
                      key={`rect-${row}-${col}`}
                      x={28 + col * 26}
                      y={32 + row * 26}
                      width={26}
                      height={26}
                      fill="#bae6fd"
                      stroke="#0284c7"
                      strokeWidth="1.2"
                    />
                  ))
                )}

                {/* Outer border */}
                <rect x="28" y="32" width="208" height="104" fill="none" stroke="#0369a1" strokeWidth="3.5" rx="6" />

                {/* Center Formula Badge */}
                <rect x="76" y="68" width="112" height="32" rx="8" fill="#ffffff" opacity="0.96" stroke="#0369a1" strokeWidth="2" />
                <text x="132" y="90" textAnchor="middle" fill="#0369a1" fontSize="15" fontWeight="900">
                  32 ô = 32 cm²
                </text>
              </svg>

              <span className="text-sm sm:text-base text-sky-950 mt-3 font-extrabold text-center">
                Mỗi ô vuông = 1 cm² · Gồm 4 hàng, mỗi hàng có 8 ô vuông đơn vị = 32 ô vuông
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIPS & COMMON PITFALLS */}
      {activeTab === 'tips' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-9 border-2 border-emerald-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
            <ThoToanHoc size="md" />
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 whitespace-nowrap">
                Bí Kíp Ghi Nhớ Của Thỏ Trắng
              </h2>
              <p className="text-xs sm:text-sm text-emerald-700 font-medium">Những mẹo vàng để luôn làm đúng 100% bài thi!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-black text-base lg:text-lg">
                <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>1. Phân biệt Chu vi &amp; Diện tích</span>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-medium">
                • <strong>Chu vi</strong> là độ dài đường viền bao quanh hình (đơn vị: cm, m).<br />
                • <strong>Diện tích</strong> là toàn bộ phần mặt phẳng nằm bên trong (đơn vị: cm², m²).
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-sky-50/80 border-2 border-sky-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-sky-900 font-black text-base lg:text-lg">
                <CheckCircle className="w-5 h-5 text-sky-600 shrink-0" />
                <span>2. Đổi về cùng đơn vị đo</span>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-medium">
                Nếu chiều dài là <strong>dm</strong>, chiều rộng là <strong>cm</strong>, con phải đổi về cùng <strong>cm</strong> trước khi thực hiện phép nhân tính diện tích: S = a × b!
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-purple-50/80 border-2 border-purple-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-purple-900 font-black text-base lg:text-lg">
                <CheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                <span>3. Bài toán ngược (Biết S tìm cạnh)</span>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-medium">
                • <strong>Hình vuông</strong>: Tìm số nào nhân với chính nó bằng diện tích (Ví dụ: S = 49 cm² → cạnh = 7 cm vì 7 × 7 = 49).<br />
                • <strong>Hình chữ nhật</strong>: Chiều dài = Diện tích : Chiều rộng.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base lg:text-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>4. Đếm hình trên lưới ô vuông</span>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-medium">
                • 2 nửa ô vuông tam giác ghép lại = 1 ô vuông hoàn chỉnh.<br />
                • Với hình có cửa sổ / khoét lỗ: Lấy diện tích hình bao trừ đi diện tích các lỗ khoét!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onBackToHome();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs sm:text-sm lg:text-base hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          ← Quay lại Trang Chủ
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onStartPractice();
          }}
          className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>ĐÃ HIỂU BÀI · VÀO LUYỆN TẬP</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
