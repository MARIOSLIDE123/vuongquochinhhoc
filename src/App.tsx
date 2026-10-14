import React, { useState, useEffect } from 'react';
import { AttemptRecord, Question, SessionSummary, StudentProfile, ViewState } from './types/math';
import { QUESTIONS } from './data/questions';
import { dataService } from './services/dataService';
import { soundService } from './services/soundService';
import { BeVuong, BeChuNhat, ThoToanHoc } from './components/Characters';
import { QuestionRenderer } from './components/QuestionRenderer';
import { FeedbackModal } from './components/FeedbackModal';
import { TheoryView } from './components/TheoryView';
import { SgkSelector } from './components/SgkSelector';
import { HomeScreen } from './components/HomeScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { LeaderboardView } from './components/LeaderboardView';
import { RegisterModal } from './components/RegisterModal';
import {
  Volume2,
  VolumeX,
  Home,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

export function App() {
  // Current view navigation
  const [currentView, setCurrentView] = useState<ViewState>('welcome');

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(soundService.getMuted());

  // Student Profile
  const [student, setStudent] = useState<StudentProfile | null>(null);

  // Practice session state
  const [activeQuestionList, setActiveQuestionList] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // 2-Try Enforcement state
  const [attemptNumber, setAttemptNumber] = useState<1 | 2>(1);
  const [isQuestionLocked, setIsQuestionLocked] = useState<boolean>(false);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());

  // Feedback modal state
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    attemptNo: 1 | 2;
  }>({
    isOpen: false,
    isCorrect: false,
    attemptNo: 1
  });

  // Current session statistics
  const [sessionStats, setSessionStats] = useState<{
    correctFirstTry: number;
    correctSecondTry: number;
    wrongCount: number;
    pointsEarned: number;
    results: {
      questionId: string;
      isCorrect: boolean;
      pointsAwarded: number;
      attemptCount: number;
    }[];
  }>({
    correctFirstTry: 0,
    correctSecondTry: 0,
    wrongCount: 0,
    pointsEarned: 0,
    results: []
  });

  // Completed session summary
  const [lastSummary, setLastSummary] = useState<SessionSummary | null>(null);
  const [syncStatus, setSyncStatus] = useState<'demo' | 'synced' | 'error' | 'syncing'>('demo');

  // Load existing student on boot
  useEffect(() => {
    try {
      const lastId = localStorage.getItem('vqdt_last_student_id');
      if (lastId) {
        const saved = localStorage.getItem(`vqdt_profile_${lastId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setStudent(parsed);
          setCurrentView('home');
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleSound = () => {
    const next = soundService.toggleMute();
    setIsMuted(next);
  };

  const handleRegisterComplete = async (profile: StudentProfile) => {
    setStudent(profile);
    setCurrentView('home');
    soundService.playCorrect();

    // Register with DataService (dual mode: Demo or GAS)
    try {
      await dataService.registerStudent(profile);
    } catch {
      // Graceful fallback
    }
  };

  /**
   * Start a practice session with a specific question set
   */
  const startSession = (questions: Question[]) => {
    if (!student) {
      setCurrentView('register');
      return;
    }
    const sId = 'sess_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    setSessionId(sId);
    setSessionStartTime(Date.now());
    setActiveQuestionList(questions);
    setCurrentQuestionIndex(0);
    setAttemptNumber(1);
    setIsQuestionLocked(false);
    setSessionStats({
      correctFirstTry: 0,
      correctSecondTry: 0,
      wrongCount: 0,
      pointsEarned: 0,
      results: []
    });
    setCurrentView('practice');
  };

  /**
   * Handle Question Answer Submission with strict 2-try mechanism
   */
  const handleAnswerSubmit = async (userAnswer: unknown) => {
    if (isQuestionLocked || !student) return;

    const currentQ = activeQuestionList[currentQuestionIndex];
    if (!currentQ) return;

    // Evaluate answer correctness
    const isCorrect = evaluateAnswer(currentQ, userAnswer);
    const attemptNo = attemptNumber;

    if (isCorrect) {
      // Correct!
      soundService.playCorrect();
      const points = attemptNo === 1 ? 10 : 5;

      // Update session statistics
      setSessionStats((prev) => ({
        ...prev,
        correctFirstTry: attemptNo === 1 ? prev.correctFirstTry + 1 : prev.correctFirstTry,
        correctSecondTry: attemptNo === 2 ? prev.correctSecondTry + 1 : prev.correctSecondTry,
        pointsEarned: prev.pointsEarned + points,
        results: [
          ...prev.results,
          {
            questionId: currentQ.id,
            isCorrect: true,
            pointsAwarded: points,
            attemptCount: attemptNo
          }
        ]
      }));

      // Update student points in state & localStorage
      const updatedStudent: StudentProfile = {
        ...student,
        points: (student.points || 0) + points,
        completedQuestions: (student.completedQuestions || 0) + 1,
        lastActiveAt: new Date().toISOString()
      };
      setStudent(updatedStudent);
      localStorage.setItem(`vqdt_profile_${student.studentId}`, JSON.stringify(updatedStudent));

      // Record attempt asynchronously
      const record: AttemptRecord = {
        attemptId: `att_${sessionId}_${currentQ.id}_${attemptNo}`,
        sessionId,
        studentId: student.studentId,
        questionId: currentQ.id,
        questionType: currentQ.questionType,
        answerJson: JSON.stringify(userAnswer),
        attemptNo,
        isCorrect: true,
        pointsAwarded: points,
        createdAt: new Date().toISOString()
      };
      dataService.recordAttempt(record).catch(() => {});

      // Lock current question to prevent point farming
      setIsQuestionLocked(true);
      setAnsweredQuestionIds((prev) => new Set(prev).add(currentQ.id));

      // Open celebration feedback modal
      setFeedbackState({
        isOpen: true,
        isCorrect: true,
        attemptNo
      });
    } else {
      // Wrong!
      soundService.playTryAgain();

      if (attemptNo === 1) {
        // First try wrong -> allow 1 retry with hint
        const record: AttemptRecord = {
          attemptId: `att_${sessionId}_${currentQ.id}_1`,
          sessionId,
          studentId: student.studentId,
          questionId: currentQ.id,
          questionType: currentQ.questionType,
          answerJson: JSON.stringify(userAnswer),
          attemptNo: 1,
          isCorrect: false,
          pointsAwarded: 0,
          createdAt: new Date().toISOString()
        };
        dataService.recordAttempt(record).catch(() => {});

        setFeedbackState({
          isOpen: true,
          isCorrect: false,
          attemptNo: 1
        });
      } else {
        // Second try wrong -> 0 points, reveal solution, lock question
        setSessionStats((prev) => ({
          ...prev,
          wrongCount: prev.wrongCount + 1,
          results: [
            ...prev.results,
            {
              questionId: currentQ.id,
              isCorrect: false,
              pointsAwarded: 0,
              attemptCount: 2
            }
          ]
        }));

        const updatedStudent: StudentProfile = {
          ...student,
          completedQuestions: (student.completedQuestions || 0) + 1,
          lastActiveAt: new Date().toISOString()
        };
        setStudent(updatedStudent);
        localStorage.setItem(`vqdt_profile_${student.studentId}`, JSON.stringify(updatedStudent));

        const record: AttemptRecord = {
          attemptId: `att_${sessionId}_${currentQ.id}_2`,
          sessionId,
          studentId: student.studentId,
          questionId: currentQ.id,
          questionType: currentQ.questionType,
          answerJson: JSON.stringify(userAnswer),
          attemptNo: 2,
          isCorrect: false,
          pointsAwarded: 0,
          createdAt: new Date().toISOString()
        };
        dataService.recordAttempt(record).catch(() => {});

        setIsQuestionLocked(true);
        setAnsweredQuestionIds((prev) => new Set(prev).add(currentQ.id));

        setFeedbackState({
          isOpen: true,
          isCorrect: false,
          attemptNo: 2
        });
      }
    }
  };

  /**
   * Helper to verify answer correctness
   */
  const evaluateAnswer = (q: Question, ans: unknown): boolean => {
    switch (q.questionType) {
      case 'single_choice':
        return String(ans).trim() === String(q.correctAnswer).trim();

      case 'multi_choice': {
        if (!Array.isArray(ans) || !Array.isArray(q.correctAnswer)) return false;
        const setA = new Set(ans.map((x) => String(x).trim()));
        const setB = new Set(q.correctAnswer.map((x) => String(x).trim()));
        if (setA.size !== setB.size) return false;
        for (const item of setA) {
          if (!setB.has(item)) return false;
        }
        return true;
      }

      case 'fill_in':
        return Number(ans) === Number(q.correctAnswer);

      case 'true_false':
        return Boolean(ans) === Boolean(q.correctAnswer);

      case 'drag_drop': {
        if (typeof ans !== 'object' || ans === null) return false;
        const correctMap = q.correctAnswer as Record<string, string>;
        const userMap = ans as Record<string, string>;
        return Object.keys(correctMap).every((k) => userMap[k] === correctMap[k]);
      }

      case 'match_pairs': {
        if (typeof ans !== 'object' || ans === null) return false;
        const correctMatches = q.correctAnswer as Record<string, string>;
        const userMatches = ans as Record<string, string>;
        return Object.keys(correctMatches).every((k) => userMatches[k] === correctMatches[k]);
      }

      case 'grid_explore':
        return Number(ans) === Number(q.correctAnswer);

      default:
        return false;
    }
  };

  /**
   * Continue from feedback modal
   */
  const handleFeedbackContinue = () => {
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
    soundService.playClick();

    if (currentQuestionIndex + 1 < activeQuestionList.length) {
      // Next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setAttemptNumber(1);
      setIsQuestionLocked(false);
    } else {
      // Completed session
      completeSession();
    }
  };

  /**
   * Retry current question (Attempt #2)
   */
  const handleFeedbackRetry = () => {
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
    setAttemptNumber(2);
    setIsQuestionLocked(false);
    soundService.playClick();
  };

  /**
   * Finalize learning session & sync to backend
   */
  const completeSession = async () => {
    if (!student) return;

    soundService.playFanfare();
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    const summary: SessionSummary = {
      sessionId,
      studentId: student.studentId,
      startedAt: new Date(sessionStartTime).toISOString(),
      completedAt: new Date().toISOString(),
      totalQuestions: activeQuestionList.length,
      correctFirstTry: sessionStats.correctFirstTry,
      correctSecondTry: sessionStats.correctSecondTry,
      wrongCount: sessionStats.wrongCount,
      totalPoints: sessionStats.pointsEarned,
      xp: sessionStats.pointsEarned * 2,
      durationSeconds: duration,
      synced: false,
      questionResults: sessionStats.results
    };

    setLastSummary(summary);
    setCurrentView('summary');

    // Attempt sync
    if (dataService.isDemoMode()) {
      setSyncStatus('demo');
    } else {
      setSyncStatus('syncing');
      try {
        const res = await dataService.finishSession(summary);
        if (res && res.synced) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch {
        setSyncStatus('error');
      }
    }
  };

  const handleRetrySync = async () => {
    if (!lastSummary) return;
    setSyncStatus('syncing');
    try {
      const res = await dataService.finishSession(lastSummary);
      if (res && res.synced) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch {
      setSyncStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 text-slate-800 flex flex-col justify-between selection:bg-amber-300">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & App Name */}
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              if (student) setCurrentView('home');
              else setCurrentView('welcome');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-xl">🏰</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 block">
                Toán Tiểu Học
              </span>
              <h1 className="text-base md:text-lg font-black text-slate-900 leading-tight">
                Vương Quốc Diện Tích
              </h1>
            </div>
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Student Chip */}
            {student && (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setCurrentView('register');
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-900 hover:bg-sky-100 transition-colors cursor-pointer"
                title="Xem hồ sơ học sinh"
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px]">
                  ⭐
                </div>
                <span>{student.displayName || student.fullName}</span>
                <span className="text-amber-700">({student.points}đ)</span>
              </button>
            )}

            {/* Home Icon */}
            {student && currentView !== 'home' && (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setCurrentView('home');
                }}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Về Trang Chủ"
              >
                <Home className="w-4 h-4" />
              </button>
            )}

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-5 flex flex-col justify-center">
        {/* VIEW 1: WELCOME SCREEN */}
        {currentView === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center py-6 space-y-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <BeVuong size="lg" mood="cheering" />
              <ThoToanHoc size="lg" />
              <BeChuNhat size="lg" mood="happy" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Chinh Phục Hình Vuông &amp; Hình Chữ Nhật</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              VƯƠNG QUỐC DIỆN TÍCH
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
              Cùng Bé Vuông và Bé Chữ Nhật phiêu lưu qua các bài tập SGK, rèn luyện tư duy toán học và vinh danh trên Bảng Xếp Hạng Toàn Quốc!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setCurrentView('register');
                }}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 rounded-3xl font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BẮT ĐẦU HÀNH TRÌNH</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setCurrentView('theory');
                }}
                className="w-full sm:w-auto px-6 py-4 bg-white text-sky-700 border-2 border-sky-200 rounded-3xl font-extrabold text-sm hover:bg-sky-50 transition-all cursor-pointer"
              >
                Xem Lý Thuyết Trước
              </button>
            </div>

            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Chuẩn SGK Toán Tiểu Học
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                Xếp hạng Toàn Quốc bảo mật
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: REGISTER PROFILE */}
        {currentView === 'register' && (
          <RegisterModal onRegisterComplete={handleRegisterComplete} initialProfile={student} />
        )}

        {/* VIEW 3: HOME DASHBOARD */}
        {currentView === 'home' && student && (
          <HomeScreen
            student={student}
            onNavigate={(dest) => {
              if (dest === 'practice') {
                // Start with practice question bank
                const bank = QUESTIONS.filter((q) => q.category === 'practice');
                startSession(bank);
              } else {
                setCurrentView(dest);
              }
            }}
          />
        )}

        {/* VIEW 4: THEORY REVIEW */}
        {currentView === 'theory' && (
          <TheoryView
            studentName={student?.fullName || 'Học sinh'}
            onBackToHome={() => setCurrentView(student ? 'home' : 'welcome')}
            onStartPractice={() => {
              if (student) {
                const bank = QUESTIONS.filter((q) => q.category === 'practice');
                startSession(bank);
              } else {
                setCurrentView('register');
              }
            }}
          />
        )}

        {/* VIEW 5: SGK SELECTOR */}
        {currentView === 'sgk_select' && (
          <SgkSelector
            studentName={student?.fullName || 'Học sinh'}
            completedIds={answeredQuestionIds}
            onBackToHome={() => setCurrentView(student ? 'home' : 'welcome')}
            onStartAllSgk={() => {
              const sgkQuestions = QUESTIONS.filter((q) => q.category === 'sgk');
              startSession(sgkQuestions);
            }}
            onSelectQuestion={(qId) => {
              const target = QUESTIONS.find((q) => q.id === qId);
              if (target) {
                startSession([target]);
              }
            }}
          />
        )}

        {/* VIEW 6: PRACTICE RUNNER WITH 2-TRY MECHANISM */}
        {currentView === 'practice' && activeQuestionList.length > 0 && (
          <div className="w-full max-w-5xl mx-auto space-y-3">
            {/* Top progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-sky-100">
              <span className="flex items-center gap-1.5">
                <span>Câu hỏi:</span>
                <strong className="text-sky-600 font-extrabold text-sm">
                  {currentQuestionIndex + 1} / {activeQuestionList.length}
                </strong>
              </span>

              <div className="flex items-center gap-1.5 text-amber-600">
                <Award className="w-4 h-4" />
                <span>Điểm bài thi: {sessionStats.pointsEarned}đ</span>
              </div>
            </div>

            {/* Question Card */}
            <QuestionRenderer
              question={activeQuestionList[currentQuestionIndex]}
              attemptNumber={attemptNumber}
              isLocked={isQuestionLocked}
              onSubmit={handleAnswerSubmit}
              onRetry={handleFeedbackRetry}
              studentName={student?.fullName || 'con'}
            />

            {/* Back button */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setCurrentView(student ? 'home' : 'welcome');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
              >
                ← Tạm dừng &amp; Về Trang Chủ
              </button>
            </div>
          </div>
        )}

        {/* VIEW 7: SUMMARY SCREEN */}
        {currentView === 'summary' && lastSummary && student && (
          <SummaryScreen
            summary={lastSummary}
            student={student}
            syncStatus={syncStatus}
            onRetrySync={handleRetrySync}
            onPracticeMore={() => {
              const bank = QUESTIONS.filter((q) => q.category === 'practice');
              startSession(bank);
            }}
            onGoHome={() => setCurrentView('home')}
            onGoLeaderboard={() => setCurrentView('leaderboard')}
          />
        )}

        {/* VIEW 8: LEADERBOARD */}
        {currentView === 'leaderboard' && student && (
          <LeaderboardView
            currentStudent={student}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* FEEDBACK MODAL (Strict 2-Try Rule) */}
      {feedbackState.isOpen && activeQuestionList[currentQuestionIndex] && (
        <FeedbackModal
          isOpen={feedbackState.isOpen}
          isCorrect={feedbackState.isCorrect}
          attemptNumber={feedbackState.attemptNo}
          question={activeQuestionList[currentQuestionIndex]}
          studentName={student?.fullName || 'con'}
          onContinue={handleFeedbackContinue}
          onRetry={handleFeedbackRetry}
          isLastQuestion={currentQuestionIndex + 1 >= activeQuestionList.length}
        />
      )}

      {/* FOOTER */}
      <footer className="py-3 text-center text-xs text-slate-400 font-medium">
        Vương Quốc Diện Tích © 2026 · Toán Học Tiểu Học Vui Nhộn &amp; Trực Quan
      </footer>
    </div>
  );
}
export default App;
