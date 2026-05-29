import { useApp } from '../context/AppContext';
import StatsCard from '../components/StatsCard';
import WeeklyChart from '../components/WeeklyChart';
import ExerciseCard from '../components/ExerciseCard';
import { Clock, Flame, Trophy, Target, Sparkles, ChevronRight, Music } from 'lucide-react';
import { mockProgressStats } from '../data/mockData';

export default function Dashboard() {
  const { student, routine, navigate } = useApp();

  const completedCount = routine?.exercises.filter((e) => e.completed).length ?? 0;
  const totalCount = routine?.exercises.length ?? 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">
            Good {greeting}, {student.name.split(' ')[0]}
          </h2>
          <p className="text-surface-500 mt-1">Here's your practice overview for today.</p>
        </div>
        <button onClick={() => navigate('generate')} className="btn-primary">
          <Sparkles className="w-4 h-4" /> Generate Routine
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Practice Time" value={`${mockProgressStats.totalPracticeMinutes}`} icon={<Clock className="w-5 h-5" />} trend="+12%" color="brand" />
        <StatsCard label="Current Streak" value={`${mockProgressStats.currentStreak} days`} icon={<Flame className="w-5 h-5" />} trend="Best!" color="accent" />
        <StatsCard label="Exercises Done" value={mockProgressStats.exercisesCompleted} icon={<Trophy className="w-5 h-5" />} color="brand" />
        <StatsCard label="Grade Progress" value={`${mockProgressStats.gradeProgress}%`} icon={<Target className="w-5 h-5" />} color="surface" />
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's routine preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-600/20">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="section-title">Today's Routine</h3>
                  <p className="text-sm text-surface-500">{routine?.focusArea}</p>
                </div>
              </div>
              <button onClick={() => navigate('routine')} className="btn-ghost text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-surface-600 font-medium">{completedCount} of {totalCount} completed</span>
                <span className="text-brand-600 font-semibold">{progressPct}%</span>
              </div>
              <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full gradient-brand rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              {routine?.exercises.slice(0, 3).map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} index={i} onToggle={() => {}} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <WeeklyChart />

          {/* Grade progress */}
          <div className="card p-6">
            <h3 className="section-title mb-4">Grade {student.gradeLevel} Progress</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(mockProgressStats.gradeProgress / 100) * 314} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-surface-900">{mockProgressStats.gradeProgress}%</span>
              </div>
            </div>
            <p className="text-center text-sm text-surface-500">
              {100 - mockProgressStats.gradeProgress}% remaining to Grade {student.gradeLevel + 1}
            </p>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="section-title mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('generate')} className="w-full btn-secondary justify-start text-sm">
                <Sparkles className="w-4 h-4" /> Generate New Routine
              </button>
              <button onClick={() => navigate('instruments')} className="w-full btn-secondary justify-start text-sm">
                <Music className="w-4 h-4" /> Change Instrument
              </button>
              <button onClick={() => navigate('profile')} className="w-full btn-secondary justify-start text-sm">
                <Target className="w-4 h-4" /> Update Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
