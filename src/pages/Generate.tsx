import { useApp } from '../context/AppContext';
import { Sparkles, Wand2, Music, Target, Clock, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { instrumentOptions } from '../data/mockData';

export default function Generate() {
  const { student, isGenerating, generateError, generateRoutine } = useApp();
  const instrumentName = instrumentOptions.find((i) => i.id === student.instrument)?.name ?? student.instrument;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-700/30 ring-4 ring-brand-50">
          <Wand2 className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-surface-900 mb-3">AI Practice Generator</h2>
        <p className="text-surface-500 max-w-lg mx-auto text-lg leading-relaxed">
          Powered by Gemini AI, we'll create a personalized daily practice routine tailored to your instrument and grade level.
        </p>
      </div>

      {/* Config summary */}
      <div className="card p-8">
        <h3 className="section-title mb-5">Your Configuration</h3>
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="p-5 bg-gradient-to-br from-brand-50 to-brand-100/30 rounded-2xl text-center border border-brand-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Music className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1">Instrument</p>
            <p className="font-bold text-surface-900">{instrumentName}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-accent-50 to-accent-100/30 rounded-2xl text-center border border-accent-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1">Grade Level</p>
            <p className="font-bold text-surface-900">Grade {student.gradeLevel}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-surface-50 to-surface-100/30 rounded-2xl text-center border border-surface-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-surface-400 to-surface-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1">Daily Goal</p>
            <p className="font-bold text-surface-900">{student.dailyPracticeGoal} min</p>
          </div>
        </div>
      </div>

      {/* What you'll get */}
      <div className="card p-8">
        <h3 className="section-title mb-5">What You'll Get</h3>
        <div className="space-y-3">
          {[
            { icon: Zap, title: 'Warm-Up Exercises', desc: 'Finger independence and muscle preparation drills', gradient: 'from-amber-400 to-amber-600' },
            { icon: Target, title: 'Technique & Scales', desc: 'Grade-appropriate scales, arpeggios, and technical work', gradient: 'from-brand-400 to-brand-600' },
            { icon: Music, title: 'Repertoire Practice', desc: 'Focused work on your current pieces with specific measures', gradient: 'from-rose-400 to-rose-600' },
            { icon: Sparkles, title: 'Ear Training & Theory', desc: 'Interval recognition, rhythm work, and key signature review', gradient: 'from-sky-400 to-sky-600' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-50/50 transition-all duration-300 border border-transparent hover:border-brand-100 group"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="pt-0.5">
                <p className="font-bold text-surface-800">{item.title}</p>
                <p className="text-sm text-surface-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {generateError && (
        <div className="card p-6 border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 animate-slide-up shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="font-bold text-red-800">Generation Failed</p>
              <p className="text-sm text-red-600 mt-1">{generateError}</p>
            </div>
          </div>
          <button onClick={generateRoutine} className="btn-secondary mt-4 text-sm w-full">
            Try Again
          </button>
        </div>
      )}

      {/* Generate button */}
      <div className="text-center">
        <button
          onClick={generateRoutine}
          disabled={isGenerating}
          className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-brand-700/30"
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating with Gemini AI...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate Today's Routine <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        {isGenerating && (
          <div className="mt-8 animate-fade-in">
            <div className="card p-7 max-w-md mx-auto shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 gradient-brand rounded-xl flex items-center justify-center animate-pulse-soft shadow-lg shadow-brand-700/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-surface-900">Gemini AI is working</p>
                  <p className="text-sm text-surface-500">Crafting your perfect routine...</p>
                </div>
              </div>
              <div className="h-3 bg-brand-100 rounded-full overflow-hidden">
                <div className="h-full gradient-brand rounded-full shimmer-bg animate-shimmer" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-surface-400 mt-3 text-center font-medium">This usually takes 5-10 seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
