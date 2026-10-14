import React, { useState, useEffect } from 'react';
import { Question } from '../types/math';
import { GeometryVisualizer } from './GeometryVisualizer';
import { soundService } from '../services/soundService';
import { Check, X, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  attemptNumber: 1 | 2;
  isLocked: boolean;
  onSubmit: (userAnswer: unknown) => void;
  onRetry: () => void;
  studentName: string;
}

// Utility to shuffle an array immutably
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  attemptNumber,
  isLocked,
  onSubmit,
  onRetry
}) => {
  // State for different question types
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [fillInValue, setFillInValue] = useState<string>('');
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);

  // Drag & drop state
  const [dragSlotValues, setDragSlotValues] = useState<Record<string, string>>({});
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);

  // Match pairs state
  const [pairMatches, setPairMatches] = useState<Record<string, string>>({});
  const [activeLeftPair, setActiveLeftPair] = useState<string | null>(null);

  // Grid explore state
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());

  // Shuffled options state (Requirement 3: Answers must be shuffled)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [shuffledDragItems, setShuffledDragItems] = useState<string[]>([]);
  const [shuffledRightPairs, setShuffledRightPairs] = useState<string[]>([]);

  // Reset state and shuffle options when question changes
  useEffect(() => {
    setSelectedSingle(null);
    setSelectedMulti([]);
    setFillInValue('');
    setSelectedBool(null);
    setDragSlotValues({});
    setActiveDragItem(null);
    setPairMatches({});
    setActiveLeftPair(null);
    setSelectedCells(new Set());

    // Shuffle options so answers are randomized on every question load
    if (question.options) {
      setShuffledOptions(shuffleArray(question.options));
    } else {
      setShuffledOptions([]);
    }

    if (question.dragItems) {
      setShuffledDragItems(shuffleArray(question.dragItems));
    } else {
      setShuffledDragItems([]);
    }

    if (question.matchPairs) {
      const rightItems = question.matchPairs.map((p) => p.right);
      setShuffledRightPairs(shuffleArray(rightItems));
    } else {
      setShuffledRightPairs([]);
    }
  }, [question.id]);

  const handleSubmit = (answer: unknown) => {
    soundService.playClick();
    onSubmit(answer);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-3.5 sm:p-5 lg:p-7 2xl:p-8 border-2 border-sky-100 shadow-xl shadow-sky-100/50 transition-all">
      {/* Top Question Status Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs lg:text-sm font-black uppercase tracking-wider text-sky-700 bg-sky-100/90 px-3.5 py-1 rounded-full shadow-2xs">
            {question.category === 'sgk' ? 'Bài tập SGK' : `Thử thách Cấp độ ${question.level}`}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            Lượt thử: <strong className="text-amber-600 font-bold">{attemptNumber}/2</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>+{attemptNumber === 1 ? '10' : '5'} điểm</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout (Requirement 1 & 2: Full screen width optimization, no scroll) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 2xl:gap-8 items-stretch">
        {/* LEFT COLUMN: Question Title, Description, and Geometry Diagram */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h2 className="text-base sm:text-lg lg:text-xl 2xl:text-2xl font-black text-slate-800 leading-snug mb-1.5">
            {question.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm lg:text-base 2xl:text-lg mb-2.5 leading-relaxed font-medium">
            {question.description}
          </p>

          {/* Geometry Diagram Visualization with click-to-zoom feature */}
          <GeometryVisualizer geometry={question.geometry} />
        </div>

        {/* RIGHT COLUMN: Interactive Answer Form / Options */}
        <div className="lg:col-span-6 flex flex-col justify-center bg-slate-50/70 p-3 sm:p-5 lg:p-6 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] sm:text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Lựa chọn câu trả lời của con:
          </div>

          {/* TYPE 1: SINGLE CHOICE (SHUFFLED OPTIONS) */}
          {question.questionType === 'single_choice' && shuffledOptions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-3.5">
              {shuffledOptions.map((opt, idx) => {
                const isSelected = selectedSingle === opt;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      setSelectedSingle(opt);
                      handleSubmit(opt);
                    }}
                    className={`w-full p-3 sm:p-4 lg:p-4 2xl:p-5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all transform active:scale-98 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-100 border-sky-500 shadow-sm ring-2 ring-sky-200'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/40'
                    } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm lg:text-base shrink-0 transition-colors ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm lg:text-base 2xl:text-lg leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: MULTI CHOICE (SHUFFLED OPTIONS) */}
          {question.questionType === 'multi_choice' && shuffledOptions.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {shuffledOptions.map((opt) => {
                  const isChecked = selectedMulti.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedMulti(selectedMulti.filter((x) => x !== opt));
                        } else {
                          setSelectedMulti([...selectedMulti, opt]);
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        isChecked
                          ? 'bg-sky-100 border-sky-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-sky-300'
                      } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors ${
                          isChecked ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={isLocked || selectedMulti.length === 0}
                onClick={() => handleSubmit(selectedMulti)}
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xác nhận đáp án ({selectedMulti.length} mục đã chọn)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TYPE 3: FILL IN THE BLANK */}
          {question.questionType === 'fill_in' && (
            <div className="flex flex-col items-center py-2 space-y-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border-2 border-slate-200 focus-within:border-sky-500 w-full max-w-xs shadow-xs">
                <input
                  type="number"
                  disabled={isLocked}
                  placeholder="Nhập số..."
                  value={fillInValue}
                  onChange={(e) => setFillInValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && fillInValue.trim()) {
                      handleSubmit(Number(fillInValue.trim()));
                    }
                  }}
                  className="w-full bg-transparent text-center font-black text-2xl text-slate-800 outline-none p-1 placeholder:text-slate-300 placeholder:text-lg"
                />
                {question.unitLabel && (
                  <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl text-sm shrink-0">
                    {question.unitLabel}
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={isLocked || !fillInValue.trim()}
                onClick={() => handleSubmit(Number(fillInValue.trim()))}
                className="px-8 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <span>Kiểm tra kết quả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TYPE 4: TRUE / FALSE */}
          {question.questionType === 'true_false' && (
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto w-full py-2">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  setSelectedBool(true);
                  handleSubmit(true);
                }}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedBool === true
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="font-black text-base text-emerald-800">Đúng</span>
              </button>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  setSelectedBool(false);
                  handleSubmit(false);
                }}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedBool === false
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200 shadow-md'
                    : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
                } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <X className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="font-black text-base text-rose-800">Sai</span>
              </button>
            </div>
          )}

          {/* TYPE 5: DRAG & DROP / TAP PLACEMENT (SHUFFLED NUMBERS) */}
          {question.questionType === 'drag_drop' && question.dragSlots && (
            <div className="space-y-3">
              {/* Target Equation Slots */}
              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-center gap-2 text-base font-bold text-slate-800">
                {/* Slot 1: Length */}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (activeDragItem) {
                      setDragSlotValues({ ...dragSlotValues, s1: activeDragItem });
                      setActiveDragItem(null);
                    } else if (dragSlotValues.s1) {
                      const next = { ...dragSlotValues };
                      delete next.s1;
                      setDragSlotValues(next);
                    }
                  }}
                  className={`min-w-14 h-10 px-2.5 rounded-xl border-2 border-dashed flex items-center justify-center text-base font-extrabold transition-all cursor-pointer ${
                    dragSlotValues.s1
                      ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                      : 'bg-white text-slate-400 border-sky-300 hover:border-sky-500'
                  }`}
                >
                  {dragSlotValues.s1 || '...'}
                </button>

                <span className="text-lg font-black text-sky-700">×</span>

                {/* Slot 2: Width */}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (activeDragItem) {
                      setDragSlotValues({ ...dragSlotValues, s2: activeDragItem });
                      setActiveDragItem(null);
                    } else if (dragSlotValues.s2) {
                      const next = { ...dragSlotValues };
                      delete next.s2;
                      setDragSlotValues(next);
                    }
                  }}
                  className={`min-w-14 h-10 px-2.5 rounded-xl border-2 border-dashed flex items-center justify-center text-base font-extrabold transition-all cursor-pointer ${
                    dragSlotValues.s2
                      ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                      : 'bg-white text-slate-400 border-sky-300 hover:border-sky-500'
                  }`}
                >
                  {dragSlotValues.s2 || '...'}
                </button>

                <span className="text-lg font-black text-sky-700">=</span>

                {/* Slot 3: Area */}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (activeDragItem) {
                      setDragSlotValues({ ...dragSlotValues, s3: activeDragItem });
                      setActiveDragItem(null);
                    } else if (dragSlotValues.s3) {
                      const next = { ...dragSlotValues };
                      delete next.s3;
                      setDragSlotValues(next);
                    }
                  }}
                  className={`min-w-14 h-10 px-2.5 rounded-xl border-2 border-dashed flex items-center justify-center text-base font-extrabold transition-all cursor-pointer ${
                    dragSlotValues.s3
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'bg-white text-slate-400 border-emerald-300 hover:border-emerald-500'
                  }`}
                >
                  {dragSlotValues.s3 || '...'}
                </button>

                <span className="text-xs font-bold text-slate-600">(cm²)</span>
              </div>

              {/* Shuffled Candidate Items palette */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500 mb-1.5">
                  Chạm số bên dưới rồi chạm ô trống để điền:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {shuffledDragItems.map((num) => {
                    const isSelected = activeDragItem === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setActiveDragItem(isSelected ? null : num)}
                        className={`w-11 h-11 rounded-xl font-black text-base border-2 shadow-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-amber-950 border-amber-600 scale-110 ring-2 ring-amber-300'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-sky-400'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={isLocked || !dragSlotValues.s1 || !dragSlotValues.s2 || !dragSlotValues.s3}
                onClick={() => handleSubmit(dragSlotValues)}
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kiểm tra phép tính</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TYPE 6: MATCH PAIRS (SHUFFLED RIGHT COLUMN) */}
          {question.questionType === 'match_pairs' && question.matchPairs && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 text-center">
                Chạm một mục ở cột trái rồi chạm mục tương ứng ở cột phải để nối:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Left Column */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
                    Cột trái (Cạnh)
                  </span>
                  {question.matchPairs.map((pair) => {
                    const isSelected = activeLeftPair === pair.left;
                    const isMatched = Boolean(pairMatches[pair.left]);

                    return (
                      <button
                        key={pair.left}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setActiveLeftPair(pair.left)}
                        className={`w-full p-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs'
                            : isMatched
                            ? 'bg-sky-100 border-sky-400 text-sky-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        {pair.left} {isMatched && '➔'}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column (Shuffled order) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
                    Cột phải (Diện tích)
                  </span>
                  {shuffledRightPairs.map((rightVal) => {
                    const matchedLeft = Object.entries(pairMatches).find(([, r]) => r === rightVal)?.[0];

                    return (
                      <button
                        key={rightVal}
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          if (activeLeftPair) {
                            setPairMatches({ ...pairMatches, [activeLeftPair]: rightVal });
                            setActiveLeftPair(null);
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                          matchedLeft
                            ? 'bg-sky-100 border-sky-400 text-sky-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {rightVal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isLocked || Object.keys(pairMatches).length === 0}
                  onClick={() => setPairMatches({})}
                  className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nối lại</span>
                </button>

                <button
                  type="button"
                  disabled={isLocked || Object.keys(pairMatches).length < (question.matchPairs?.length || 3)}
                  onClick={() => handleSubmit(pairMatches)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Xác nhận kết quả nối</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TYPE 7: GRID EXPLORE */}
          {question.questionType === 'grid_explore' && question.gridConfig && (
            <div className="flex flex-col items-center space-y-2.5 py-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Đã chọn:</span>
                <span className="text-sm font-black text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
                  {selectedCells.size} / {question.gridConfig.targetCount} ô vuông
                </span>
              </div>

              {/* Interactive Grid */}
              <div
                className="grid gap-1.5 p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-2xs"
                style={{
                  gridTemplateColumns: `repeat(${question.gridConfig.cols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: question.gridConfig.rows * question.gridConfig.cols }).map((_, idx) => {
                  const isSelected = selectedCells.has(idx);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        const next = new Set(selectedCells);
                        if (next.has(idx)) {
                          next.delete(idx);
                        } else {
                          next.add(idx);
                        }
                        setSelectedCells(next);
                      }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-600 scale-95 shadow-xs'
                          : 'bg-white text-slate-400 border-slate-300 hover:border-sky-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={isLocked || selectedCells.size === 0}
                onClick={() => handleSubmit(selectedCells.size)}
                className="px-8 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <span>Kiểm tra ({selectedCells.size} ô)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
