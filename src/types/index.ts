export type Instrument = 'piano' | 'guitar' | 'violin' | 'drums' | 'vocals' | 'bass' | 'flute' | 'saxophone' | 'cello' | 'trumpet';

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type PracticeCategory = 'warmup' | 'technique' | 'sight-reading' | 'repertoire' | 'ear-training' | 'theory' | 'cool-down';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  instrument: Instrument;
  gradeLevel: GradeLevel;
  dailyPracticeGoal: number;
  streak: number;
  joinedDate: string;
  bio: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  category: PracticeCategory;
  duration: number;
  difficulty: DifficultyLevel;
  instructions: string[];
  tips: string[];
  completed: boolean;
}

export interface PracticeRoutine {
  id: string;
  date: string;
  instrument: Instrument;
  gradeLevel: GradeLevel;
  totalDuration: number;
  exercises: PracticeExercise[];
  generatedBy: 'gemini-ai' | 'ai';
  focusArea: string;
}

export interface ProgressStats {
  totalPracticeMinutes: number;
  weeklyGoalProgress: number;
  exercisesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  gradeProgress: number;
}

export interface WeeklyData {
  day: string;
  minutes: number;
  completed: number;
}

export interface InstrumentOption {
  id: Instrument;
  name: string;
  description: string;
}
