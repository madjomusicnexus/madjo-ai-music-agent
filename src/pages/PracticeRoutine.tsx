import { useApp } from '../context/AppContext';
import ExerciseCard from '../components/ExerciseCard';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PracticeRoutine() {
  const { routine, toggleExercise, navigate } = useApp();

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-xl font-semibold text-surface-900 mb-2">No Routine Yet</h3>
        <p className="text-surface-500 mb-6 text-center max-w-md">Generate your personalized practice routine powered by AI.</p>
        <button onClick={() => navigate('generate')} className="btn-primary"><Sparkles className="w-4 h-4" /> Generate Routine</button>
      </div>
    );
  }

  const completedCount = routine.exercises.filter((e) => e.completed).length;
  const totalCount = routine.exercises.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalDuration = routine.exercises.reduce((sum, e) => sum + e.duration, 0);
  const completedDuration = routine.exercises.filter((e) => e.completed).reduce((sum, e) => sum + e.duration, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('dashboard')} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-surface-900">Today's Practice</h2>
          <p className="text-surface-500">{routine.focusArea}</p>
        </div>
        <span className="badge-accent"><Sparkles className="w-3 h-3" /> AI Generated</span>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-surface-900">{completedCount}/{totalCount}</p>
            <p className="text-xs text-surface-500">Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-surface-900">{completedDuration}/{totalDuration}</p>
            <p className="text-xs text-surface-500">Minutes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-600">{progressPct}%</p>
            <p className="text-xs text-surface-500">Complete</p>
          </div>
        </div>
        <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full gradient-brand rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {routine.exercises.map((ex, i) => (
          <ExerciseCard key={ex.id} exercise={ex} index={i} onToggle={toggleExercise} />
        ))}
      </div>

      {/* Completion */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="card p-8 text-center animate-slide-up border-brand-200 bg-brand-50/30">
          <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-surface-900 mb-1">Routine Complete!</h3>
          <p className="text-surface-500">Great job finishing all {totalCount} exercises today!</p>
          <button onClick={() => navigate('dashboard')} className="btn-primary mt-4">Back to Dashboard</button>
        </div>
      )}
    </div>
  );
}
