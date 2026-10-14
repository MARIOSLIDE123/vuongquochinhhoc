export type QuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'fill_in'
  | 'true_false'
  | 'drag_drop'
  | 'match_pairs'
  | 'grid_explore';

export type QuestionCategory = 'sgk' | 'practice';

export interface GeometryData {
  shape: 'square' | 'rectangle' | 'house_cards' | 'garden' | 'composite_l' | 'grid' | 'comparison';
  side?: number;
  width?: number;
  height?: number;
  perimeter?: number;
  area?: number;
  unit: 'cm' | 'm' | 'ô vuông';
  unitSquare?: 'cm²' | 'm²' | 'ô vuông';
  gridRows?: number;
  gridCols?: number;
  label?: string;
  subLabel?: string;
  hintShape?: string;
  stepSvgData?: {
    showFormula?: boolean;
    showGrid?: boolean;
    highlightArea?: boolean;
  };
}

export interface Question {
  id: string;
  category: QuestionCategory;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  questionType: QuestionType;
  points: number; // Max 10
  options?: string[];
  correctAnswer: string | string[] | number | boolean | Record<string, string>;
  unitLabel?: string;
  hint: string;
  explanation: string;
  geometry: GeometryData;
  dragItems?: string[];
  dragSlots?: { id: string; expected: string; label: string }[];
  matchPairs?: { left: string; right: string }[];
  gridConfig?: {
    rows: number;
    cols: number;
    targetCount: number;
    targetWidth?: number;
    targetHeight?: number;
  };
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  displayName: string;
  school: string;
  className: string;
  avatarId: string;
  points: number;
  xp: number;
  completedQuestions: number;
  stars: number;
  badges: string[];
  streakDays: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface AttemptRecord {
  attemptId: string;
  sessionId: string;
  studentId: string;
  questionId: string;
  questionType: QuestionType;
  answerJson: string;
  attemptNo: 1 | 2;
  isCorrect: boolean;
  pointsAwarded: number;
  createdAt: string;
}

export interface SessionSummary {
  sessionId: string;
  studentId: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctFirstTry: number;
  correctSecondTry: number;
  wrongCount: number;
  totalPoints: number;
  xp: number;
  durationSeconds: number;
  synced: boolean;
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    pointsAwarded: number;
    attemptCount: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  displayName: string;
  school: string;
  className: string;
  points: number;
  completedCount: number;
  badges: string[];
  isCurrentUser?: boolean;
}

export type ViewState =
  | 'welcome'
  | 'register'
  | 'home'
  | 'theory'
  | 'sgk_select'
  | 'practice'
  | 'summary'
  | 'leaderboard';
