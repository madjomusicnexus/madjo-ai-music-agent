import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { StudentProfile, Instrument, GradeLevel, PracticeRoutine, PracticeExercise } from '../types';
import { mockStudent, mockPracticeRoutine } from '../data/mockData';
import { supabase } from '../lib/supabase';

export type Page = 'dashboard' | 'profile' | 'instruments' | 'routine' | 'generate' | 'teacher';

interface AppState {
  page: Page;
  student: StudentProfile;
  routine: PracticeRoutine | null;
  isGenerating: boolean;
  generateError: string | null;
}

interface AppContextValue extends AppState {
  navigate: (page: Page) => void;
  setInstrument: (instrument: Instrument) => void;
  setGradeLevel: (grade: GradeLevel) => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  generateRoutine: () => void;
  toggleExercise: (exerciseId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    page: 'dashboard',
    student: mockStudent,
    routine: mockPracticeRoutine,
    isGenerating: false,
    generateError: null,
  });

  const navigate = useCallback((page: Page) => {
    setState((s) => ({ ...s, page }));
  }, []);

  const setInstrument = useCallback((instrument: Instrument) => {
    setState((s) => ({ ...s, student: { ...s.student, instrument } }));
  }, []);

  const setGradeLevel = useCallback((gradeLevel: GradeLevel) => {
    setState((s) => ({ ...s, student: { ...s.student, gradeLevel } }));
  }, []);

  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    setState((s) => ({ ...s, student: { ...s.student, ...updates } }));
  }, []);

  const toggleExercise = useCallback((exerciseId: string) => {
    setState((s) => {
      if (!s.routine) return s;
      const exercises = s.routine.exercises.map((ex: PracticeExercise) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );
      return { ...s, routine: { ...s.routine, exercises } };
    });
  }, []);

  const generateRoutine = useCallback(async () => {
    setState((s) => ({ ...s, isGenerating: true, generateError: null }));

    try {
      const { instrument, gradeLevel, dailyPracticeGoal } = state.student;

      const { data, error } = await supabase.functions.invoke('generate-routine', {
        body: {
          instrument,
          gradeLevel,
          dailyPracticeGoal,
        },
      });

      console.log("SUPABASE RESPONSE:", data);
      console.log("SUPABASE ERROR:", error);

      if (error) {
        throw new Error(error.message || 'Failed to call edge function');
      }

      if (!data || !data.exercises || !Array.isArray(data.exercises)) {
        throw new Error('Invalid response from AI — missing exercises');
      }

      const routine: PracticeRoutine = {
        id: `routine-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        instrument,
        gradeLevel,
        focusArea: data.focusArea || `Grade ${gradeLevel} ${instrument} Practice`,
        totalDuration: data.exercises.reduce((sum: number, e: PracticeExercise) => sum + (e.duration || 0), 0),
        generatedBy: 'ai',
        exercises: data.exercises.map((ex: Record<string, unknown>, i: number) => ({
          id: ex.id || `ex-${i + 1}`,
          title: ex.title || `Exercise ${i + 1}`,
          description: ex.description || '',
          category: ex.category || 'technique',
          duration: Number(ex.duration) || 5,
          difficulty: ex.difficulty || 'intermediate',
          instructions: Array.isArray(ex.instructions) ? ex.instructions : [],
          tips: Array.isArray(ex.tips) ? ex.tips : [],
          completed: false,
        })),
      };

      setState((s) => ({
        ...s,
        isGenerating: false,
        routine,
        page: 'routine' as Page,
      }));

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate routine';
      setState((s) => ({ ...s, isGenerating: false, generateError: message }));
    }
  }, [state.student]);

  return (
    <AppContext.Provider
      value={{ ...state, navigate, setInstrument, setGradeLevel, updateProfile, generateRoutine, toggleExercise }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}